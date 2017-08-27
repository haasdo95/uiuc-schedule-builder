import pymongo
from pymongo import MongoClient
import json

import os
cwd = os.getcwd()

def json2db():
    client = MongoClient('localhost', 27017)
    db = client['scheduler']

    with open(cwd + "/courseCrawler/allCourses.json") as f:
        data = json.load(f)
        data = data['courses']
        for d in data:
            db.courses.insert_one(d)

if __name__ == "__main__":
    json2db()