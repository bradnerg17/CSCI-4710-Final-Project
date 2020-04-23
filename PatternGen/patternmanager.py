from flask import Flask
from flask import render_template
from flask import url_for

app = Flask(__name__, template_folder='templates', static_folder='templates/static')

@app.route("/")
def home():
    return render_template("default.html")

@app.route("/about")
def about():
	return render_template("about.html")
	
if __name__ == "__main__":
    app.run(debug=True)
	
url_for('static', filename='main.js')
