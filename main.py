from flask import Flask, redirect

app = Flask(__name__)

@app.get("/")
async def home():
    return """<div class="flex items-center justify-center h-screen bg-discord-gray text-white" >
        <a id="login" href="https://discord.com/api/oauth2/authorize?client_id=1142575897753440288&redirect_uri=http%3A%2F%2Fdeepnarrationlogin.matissetec.dev%2Fauth%2Fdiscord&response_type=token&scope=identify" >
            <span>Login with Discord</span>
        </a>
    </div>"""

@app.get("/auth/discord")
async def authed():
    return redirect("https://deepnarration.matissetec.dev/")

app.run(debug=True, host="0.0.0.0", port=53134)