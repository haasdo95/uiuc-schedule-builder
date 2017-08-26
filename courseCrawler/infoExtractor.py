from bs4 import BeautifulSoup


class infoExtractor:
    def __init__(self, text):
        self.b = []
        if isinstance(text,list):
            self.b = (BeautifulSoup(t, 'xml') for t in text)
        else:
            self.b = [BeautifulSoup(text, 'xml')]

    def find_sub(self, **kwargs):
        if "subject_name" in kwargs:
            return self.b.find("subject", text=kwargs['subject_name'])['href']
        elif 'id' in kwargs:
            return self.b.find('subject', id=kwargs['id'])['href']

    # def find_course(self, **kwargs):
    #     if "CRN" in kwargs:
    #         b = BeautifulSoup(self.r.text, 'xml')
    #         return b.find("detailedSection", id=str(kwargs['CRN']))['href']
    #     elif 'id' in kwargs:
    #         b = BeautifulSoup(self.r.text, 'xml')
    #         return b.find('course', id=kwargs['id'])['href']

    def findAllSub(self):
        m = (x.find_all('subject') for x in self.b)
        bigList = []
        for i in m:
            bigList += i
        return [x['href'] for x in bigList]

    def findAllCourses(self):
        m = (x.find_all('course') for x in self.b)
        bigList = []
        for i in m:
            bigList += i
        return [x['href'] for x in bigList]
