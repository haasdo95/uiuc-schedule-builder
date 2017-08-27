import json

from infoExtractor import infoExtractor
import pymongo
from pymongo import MongoClient
import copy


class json_dumper(infoExtractor):
    def __init__(self, text):
        super(json_dumper, self).__init__(text)
        client = MongoClient('localhost', 27017)
        self.db = client['coursesData']

    def dump(self, fileName, insertDB):
        classList = []
        f = open(fileName, 'w')
        with open('errorLog','w') as err:
            for i in self.b:
                name = i.find('ns2:course')['id']
                detail = i.find_all('detailedSection')
                sections = []
                for j in detail:
                    try:
                        section = j.find('sectionNumber').get_text().strip()
                        crn = j['id']
                        type = j.find('type')['code']
                        m = j.find('meeting')
                        meeting = {'date': m.daysOfTheWeek.get_text().strip(),
                                   'time': {'from': m.start.get_text().strip(), 'to': m.end.get_text().strip()}}
                        sections.append({'section': section, 'crn': crn, 'type': type, 'meetings': meeting})
                    except:
                        print('CourseName:',name,file=err)
                        print(j.prettify("utf-8"),file=err)
                    post = {'name': name, 'sections': sections}
                classList.append(copy.deepcopy(post))
                if insertDB:
                    self.db.posts.insert_one(post)
            json.dump(classList, fp=f)

    def cahce_xml(self):
        for i in self.b:
            with open('./cached_xml/' + i.find('ns2:course')['id'] + '.xml', 'w') as f:
                print(i, file=f)
