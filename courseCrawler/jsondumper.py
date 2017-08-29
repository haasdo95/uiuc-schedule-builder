import json

from InfoExtractor import InfoExtractor
import pymongo
from pymongo import MongoClient
import copy


class JsonDumper(InfoExtractor):
    """
    This class is inherited from
    """

    def __init__(self, text):
        super(JsonDumper, self).__init__(text)
        client = MongoClient('localhost', 27017)
        self.db = client['scheduler']

    def dump(self, fileName, insertDB):

        """

        :param fileName: The file name of the json dump
        :param insertDB: if True, then all of the data will be inserted into mongoDB
        """
        classList = []
        f = open(fileName, 'w')
        with open('errorLog', 'w') as err:
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
                        print('CourseName:', name, file=err)
                        print(j.prettify("utf-8"), file=err)
                    post = {'name': name, 'sections': sections}
                classList.append(copy.deepcopy(post))
                if insertDB:
                    self.db.courses.insert_one(post)
            json.dump({'courses': classList}, fp=f)
