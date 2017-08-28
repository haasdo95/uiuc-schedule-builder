import time

from addrBuilder import addrBuilder
from InfoExtractor import InfoExtractor
from jsondumper import JsonDumper
from xmlgetter import XmlGetter


def get_all_subject(insertDB):
    """

    :param insertDB: if True, then all of the data will be inserted into mongoDB
    """
    start = time.time()
    builder = addrBuilder('2018', 'spring')
    subjectGetter = XmlGetter()
    subjectGetter.add_get_content_coroutine(builder.build())
    print('Please wait, getting all subjects...')
    a = subjectGetter.run_getter()
    all_addr = InfoExtractor(a)
    addr_list = all_addr.find_all_sub()
    courseGetter = XmlGetter()
    for i in addr_list:
        courseGetter.add_get_content_coroutine(i)
    print('Please wait, getting all courses...')
    a = courseGetter.run_getter()
    all_courses = InfoExtractor(a)
    courses_list = all_courses.find_all_courses()

    detail_courses = list(map(lambda x: x + '?mode=detail', courses_list))
    detailGetter = XmlGetter()
    for i in detail_courses:
        detailGetter.add_get_content_coroutine(i)
    print('Please wait, getting all sections...')
    a = detailGetter.run_getter()
    all_detail = JsonDumper(a)

    all_detail.dump('allCourses.json', True)

    print('Time used: ', time.time() - start)
