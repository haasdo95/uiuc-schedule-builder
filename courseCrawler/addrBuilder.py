class addrBuilder:
    base = 'https://courses.illinois.edu/cisapp/explorer/schedule/'

    # __slots__ = ('season','course','courseNumber','section')
    def __init__(self, year, season, **kwargs):
        self.year = year
        self.season = season
        if 'course' in kwargs:
            self.course = kwargs['course']
        if 'season' in kwargs:
            self.course = kwargs['course']
        if 'courseNumber' in kwargs:
            self.courseNumber = kwargs['courseNumber']
        if 'crn' in kwargs:
            self.crn = kwargs['crn']

    def build(self, mode=None):
        props_dict = self.__dict__
        addr = addrBuilder.base + '/'.join(v for k, v in props_dict.items()) + '.xml'
        if mode != None:
            addr += '?mode=' + mode
        return addr


# a = addrBuilder('2018','spring', course='CS', courseNumber='241')
# print(a.build('detail'))
