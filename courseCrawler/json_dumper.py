import json

from infoExtractor import infoExtractor


class json_dumper(infoExtractor):
    def __init__(self, text):
        super(json_dumper,self).__init__(text)

    def dump(self,fileName):
        classList = []
        f = open(fileName,'w')
        for i in self.b:
            name = i.find('ns2:course')['id']
            detail = i.find_all('detailedSection')
            sections = []
            for j in detail:
                section = j.find('sectionNumber').get_text().strip()
                crn = j['id']
                type = j.find('type')['code']
                m = j.find('meeting')
                try:
                    meeting = {'date':m.daysOfTheWeek.get_text().strip(),'time':{'from':m.start.get_text().strip(),'to':m.end.get_text().strip()}}
                    sections.append({'section':section,'crn':crn,'type':type,'meetings':meeting})
                except AttributeError:
                    continue
                classList.append({'name':name,'sections':sections})
        json.dump(classList,fp=f)
        # print(json.dumps(classList,indent=2))
    def cahce_xml(self):
        for i in self.b:
            with open('./cached_xml/'+i.find('ns2:course')['id']+'.xml','w') as f:
                print(i,file=f)
