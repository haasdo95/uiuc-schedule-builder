from pymongo import MongoClient
from getAllsubject import get_all_subject
import json
import sys
import getopt
import os

cwd = os.getcwd()


def json2db():
    client = MongoClient('mongodb://ChuchaoLuo:aaaaaa@ds111204.mlab.com:11204/uiuc-scheduler', 27017)
    db = client['uiuc-scheduler']

    with open(cwd + "/allCourses.json") as f:
        data = json.load(f)
        data = data['courses']
        for d in data:
            db.courses.insert_one(d)


def printHelp():
    """
    print tutorial
    """
    print('Tutorial:')
    print('-j <fileName>: load the json object from <fileName>')
    print('-f: just get json file')
    print('-d: get json and insert into db')
    print('you should only use exactly one option')


if __name__ == "__main__":
    if len(sys.argv) == 1:
        printHelp()
        exit(1)
    option, others = getopt.getopt(sys.argv[1:], 'j:fd')
    if '-j' in option[0]:
        json2db()
    elif '-f' in option[0]:
        get_all_subject(False)
    elif '-d' in option[0]:
        get_all_subject(True)
    else:
        printHelp()
        exit(1)
