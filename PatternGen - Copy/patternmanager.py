import os

from flask import Flask
from flask import redirect
from flask import render_template
from flask import request
from flask import url_for
from flask_sqlalchemy import SQLAlchemy

project_dir = os.path.dirname(os.path.abspath(__file__))
database_file = "sqlite:///{}".format(os.path.join(project_dir, "patterndatabase.db"))

app = Flask(__name__, template_folder='templates', static_folder='templates/static')

app.config["SQLALCHEMY_DATABASE_URI"] = database_file

db = SQLAlchemy(app)

class Pattern(db.Model):
	CSS_CODE = db.Column(db.String(80000), unique=True, nullable=False, primary_key=True)

	def __repr__(self):
		return "<CSS_CODE: {}>".format(self.CSS_CODE)


@app.route('/', methods=["GET", "POST"])
def home():
	patterns = None
	if request.form:
		try:
			pattern = Pattern(CSS_CODE=request.form.get("CSS_CODE"))
			db.session.add(pattern)
			db.session.commit()
		except Exception as e:
			print("Failed to add book")
			print(e)
	patterns = Pattern.query.all()
	return render_template("default.html", patterns=patterns)
	
	
	
@app.route("/update", methods=["POST"])
def update():
	try:
		newCSS_CODE = request.form.get("newCSS_CODE")
		oldCSS_CODE = request.form.get("oldCSS_CODE")
		pattern = Pattern.query.filter_by(CSS_CODE=oldCSS_CODE).first()
		pattern.CSS_CODE = newCSS_CODE
		db.session.commit()
	except Exception as e:
		print("Couldn't update book CSS_CODE")
		print(e)
	return redirect("/")

@app.route("/delete", methods=["POST"])
def delete():
	CSS_CODE = request.form.get("CSS_CODE")
	pattern = Pattern.query.filter_by(CSS_CODE=CSS_CODE).first()
	db.session.delete(pattern)
	db.session.commit()
	return redirect("/")


@app.route("/about")
def about():
	return render_template("about.html")
	
@app.route('/main.js')
def maninJS():
	return redirect(url_for('static', filename='main.js'))
	
if __name__ == "__main__":
	app.run(debug=True)
	

