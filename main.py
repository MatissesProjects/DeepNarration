from flask import Flask, redirect, send_file

app = Flask(__name__)

@app.get("/")
async def home():
    return """<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        html,
        body {
            background: #26262b;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            font-family: Whitney, "Open Sans", Helvetica, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            text-align: center;
            line-height: 1.15;
        }

        .wrapper-buttons {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 20px;
        }

        .blue-button {
            font-weight: 400;
            font-size: 11pt;
            border-radius: 3px;
            cursor: pointer;
            height: 45px;
            width: 250px;
            box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.2);
            background-color: #7289da;
            border: 2px solid #7289da;
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .text-around {
            margin-bottom: 20px;
            margin-top: 20px;
            color: #ccc;
        }
    </style>
</head>

<body>
    <div class="text-around">
        <p>To use this application please log in with discord</p>
    </div>
    <div class="wrapper-buttons">
        <a id="login" class="blue-button"
            href="https://discord.com/api/oauth2/authorize?client_id=1142575897753440288&redirect_uri=http%3A%2F%2Fdeepnarrationlogin.matissetec.dev%2Fauth%2Fdiscord&response_type=token&scope=identify">
            Login with Discord
        </a>
    </div>
    <div class="text-around">
        <p>There will be a link to the discord to grab the final video from on the page after you submit the video</p>
    </div>
</body>

</html>
"""

@app.get("/.well-known/discord")
async def discord():
    return send_file("C:\\Users\\matis\\GitHub\\DeepNarration\\.well-known\\discord")

@app.get("/auth/discord")
async def authed():
    return redirect("https://deepnarration.matissetec.dev/")

app.run(debug=True, host="0.0.0.0", port=53134)