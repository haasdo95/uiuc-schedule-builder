import bs4


class InfoExtractor:
    """
    This class is for extracting specific infomation from source code, receiving a list of xml source code
    """

    def __init__(self, text):
        self.b = []
        if isinstance(text,list):
            self.b = (bs4.BeautifulSoup(t, 'xml') for t in text)
        else:
            self.b = [bs4.BeautifulSoup(text, 'xml')]

    def find_sub(self, **kwargs):
        """

        :param kwargs: key words can be 'id'(crn) or 'subject_name'('CS 125' etc...)
        :return: a beautifulSoup tag object
        """
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

    def find_all_sub(self):
        """

        :return: a list of URL corresponding to every subject(CS, MATH, etc...)
        """
        m = (x.find_all('subject') for x in self.b)
        bigList = []
        for i in m:
            bigList += i
        return [x['href'] for x in bigList]

    def find_all_courses(self):
        """

        :return: a list of URLs corresponding to every course(CS 255, MATH241, etc...)
        """
        m = (x.find_all('course') for x in self.b)
        bigList = []
        for i in m:
            bigList += i
        return [x['href'] for x in bigList]
