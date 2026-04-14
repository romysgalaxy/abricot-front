// Route API serveur Next.js pour la génération de tâches via Mistral AI
// Cette route s'exécute côté serveur uniquement, ce qui permet de sécuriser la clé API
// (elle n'est jamais exposée au navigateur du client)
export async function POST(request) {
  // Récupération de la clé API depuis les variables d'environnement serveur (.env.local)
  const apiKey = process.env.MISTRAL_API_KEY;

  // Gestion d'erreur : si la clé n'est pas configurée, on retourne une erreur 500
  if (!apiKey) {
    return Response.json(
      { message: 'Clé API Mistral non configurée' },
      { status: 500 }
    );
  }

  try {
    // Extraction des données envoyées par le client (le prompt utilisateur + contexte du projet)
    const { prompt, projectName, projectDescription } = await request.json();

    // Validation : le prompt est obligatoire
    if (!prompt) {
      return Response.json(
        { message: 'Le prompt est requis' },
        { status: 400 }
      );
    }

    // Construction du prompt système (system) qui cadre le comportement de l'IA :
    // - Rôle : assistant de gestion de projet
    // - Format de sortie : JSON avec un tableau "tasks"
    // - Chaque tâche contient : title, description, status (toujours TODO)
    // - Entre 3 et 6 tâches générées
    const systemContent = [
      'Tu es un assistant de gestion de projet.',
      'Tu génères des tâches pertinentes à partir de la demande de l\'utilisateur.',
      'Réponds uniquement avec un objet JSON contenant un tableau "tasks".',
      'Chaque tâche doit avoir les champs: title (string), description (string), status (toujours "TODO").',
      'Génère entre 3 et 6 tâches adaptées à la demande.',
    ].join(' ');

    // On injecte le contexte du projet (nom + description) dans le message utilisateur
    // pour que l'IA génère des tâches pertinentes par rapport au projet en cours
    const context = projectName
      ? `Contexte du projet : "${projectName}"${projectDescription ? ` - ${projectDescription}` : ''}.\n\n`
      : '';

    // Appel à l'API Mistral (endpoint chat/completions)
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'mistral-small-latest', // Modèle léger, rapide et économique
        messages: [
          { role: 'system', content: systemContent }, // Instructions pour l'IA
          { role: 'user', content: `${context}${prompt}` }, // Prompt utilisateur + contexte projet
        ],
        // Force la réponse en JSON pur (sans markdown), ce qui facilite le parsing
        response_format: { type: 'json_object' },
        // Temperature à 0.7 : bon compromis entre créativité et cohérence
        temperature: 0.7,
      }),
    });

    // Gestion d'erreur : API Mistral indisponible, quota dépassé, clé invalide, etc.
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return Response.json(
        { message: error.message || 'Erreur lors de la communication avec Mistral' },
        { status: response.status }
      );
    }

    // Extraction du contenu de la réponse Mistral
    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    // Gestion d'erreur : réponse vide de l'IA
    if (!content) {
      return Response.json(
        { message: 'Réponse vide de Mistral' },
        { status: 500 }
      );
    }

    // Parsing du JSON retourné par Mistral et extraction du tableau de tâches
    // On gère les deux formats possibles : { tasks: [...] } ou directement [...]
    const parsed = JSON.parse(content);
    const tasks = parsed.tasks || parsed;

    // Retour des tâches au client dans le format standard de l'application
    return Response.json({ data: tasks });
  } catch (error) {
    // Gestion d'erreur globale : erreur réseau, JSON invalide, etc.
    console.error('Erreur génération IA:', error);
    return Response.json(
      { message: 'Erreur lors de la génération des tâches' },
      { status: 500 }
    );
  }
}
