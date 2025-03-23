const { validApiKey } = require("../../../utils/middleware/validApiKey");
const { validateMsTeamsToken } = require("../../../utils/microsoftTeams");

function apiAuthEndpoints(app) {
  if (!app) return;

  app.get("/v1/auth", [validApiKey], (_, response) => {
    response.status(200).json({ authenticated: true });
  });

  app.post("/v1/auth/ms-teams", async (request, response) => {
    try {
      const { token } = request.body;
      const { valid, user, error } = await validateMsTeamsToken(token);

      if (!valid) {
        return response.status(401).json({ error });
      }

      response.status(200).json({ user, token });
    } catch (e) {
      console.error(e.message, e);
      response.sendStatus(500).end();
    }
  });
}

module.exports = { apiAuthEndpoints };
