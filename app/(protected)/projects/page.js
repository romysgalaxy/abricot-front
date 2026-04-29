'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getProjects, getTasks } from '../../../services/api';
import CreateProjectModal from '../../../components/CreateProjectModal';
import styles from './Projects.module.css';

function getInitials(user) {
  if (user.name) {
    return user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  }
  return user.email.slice(0, 2).toUpperCase();
}

function ProjectCard({ project, onSelect }) {
  const tasks = project.tasks || [];
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'DONE').length;
  const progressPercent = totalTasks > 0
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  const team = [];
  if (project.owner) {
    team.push({ ...project.owner, role: 'Propriétaire' });
  }
  if (project.members) {
    project.members.forEach((m) => {
      const user = m.user || m;
      if (!team.find((t) => t.id === user.id)) {
        team.push(user);
      }
    });
  }

  return (
    <div className={styles['project-card']} onClick={() => onSelect(project.id)}>
      <h2 className={styles['project-card-name']}>{project.name}</h2>
      <p className={styles['project-card-desc']}>{project.description || 'Aucune description'}</p>

      <div className={styles['project-card-progress']}>
        <div className={styles['progress-header']}>
          <span className={styles['progress-label']}>Progression</span>
          <span className={styles['progress-percent']}>{progressPercent}%</span>
        </div>
        <div className={styles['progress-bar']}>
          <div className={styles['progress-bar-fill']} style={{ width: `${progressPercent}%` }}></div>
        </div>
        <span className={styles['progress-detail']}>{completedTasks}/{totalTasks} tâches terminées</span>
      </div>

      <div className={styles['project-card-team']}>
        <div className={styles['team-header']}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="6" cy="5" r="2.5" stroke="#999" strokeWidth="1.2"/>
            <path d="M1 14C1 11.2386 3.23858 9 6 9" stroke="#999" strokeWidth="1.2"/>
            <circle cx="11" cy="5" r="2.5" stroke="#999" strokeWidth="1.2"/>
            <path d="M11 9C13.7614 9 16 11.2386 16 14" stroke="#999" strokeWidth="1.2"/>
          </svg>
          <span className={styles['team-count']}>Équipe ({team.length})</span>
        </div>
        <div className={styles['team-members']}>
          {team.filter((m) => m.role).map((member, idx) => (
            <React.Fragment key={idx}>
              <span className={`${styles['team-avatar']} ${styles['team-avatar--owner']}`}>{getInitials(member)}</span>
              <span className={styles['team-role']}>{member.role}</span>
            </React.Fragment>
          ))}
          <div className={styles['team-others']}>
            {team.filter((m) => !m.role).map((member, idx) => (
              <span key={idx} className={styles['team-avatar']}>{getInitials(member)}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      const projectsList = data.projects || [];
      const projectsWithTasks = await Promise.all(
        projectsList.map(async (project) => {
          try {
            const tasksData = await getTasks(project.id);
            return { ...project, tasks: tasksData.tasks || [] };
          } catch {
            return { ...project, tasks: [] };
          }
        })
      );
      setProjects(projectsWithTasks);
    } catch (err) {
      console.error('Projects error:', err);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleSelectProject = (id) => {
    router.push(`/projects/${id}`);
  };

  return (
    <div className={styles['projects']}>
      <div className={styles['projects-header']}>
        <div>
          <h1 className={styles['projects-title']}>Mes projets</h1>
          <p className={styles['projects-subtitle']}>Gérez vos projets</p>
        </div>
        <button className={styles['btn-create']} onClick={() => setShowCreateModal(true)}><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> Créer un projet</button>
      </div>

      <div className={styles['projects-grid']}>
        {projects.length === 0 && (
          <p className={styles['projects-empty']}>Aucun projet pour le moment</p>
        )}
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onSelect={handleSelectProject}
          />
        ))}
      </div>

      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={loadProjects}
      />
    </div>
  );
}
