import time

from addrBuilder import addrBuilder
from infoExtractor import infoExtractor
from json_dumper import json_dumper
from xml_getter import xml_gettter

start = time.time()
builder = addrBuilder('2018', 'spring')
# print(builder.build())

subjectGetter = xml_gettter()
subjectGetter.addGetContentCoroutine(builder.build())
a = subjectGetter.run_getter()
# print(a)
all_addr = infoExtractor(a)
addr_list = all_addr.findAllSub()
# with open('allSubjects.txt', mode='w') as f:
#     for i in addr_list:
#         print(i, file=f)
courseGetter = xml_gettter()
for i in addr_list:
    courseGetter.addGetContentCoroutine(i)
a = courseGetter.run_getter()
all_courses = infoExtractor(a)
courses_list = all_courses.findAllCourses()
# with open('allCourses.txt', mode='w') as f:
#     for i in courses_list:
#         print(i, file=f)

detail_courses = list(map(lambda x:x+'?mode=detail',courses_list))
detailGetter = xml_gettter()
for i in detail_courses:
    detailGetter.addGetContentCoroutine(i)
a = detailGetter.run_getter()
all_detail = json_dumper(a)
# all_detail.cahce_xml()
all_detail.dump('allCourses.json')

print('Time used: ', time.time() - start)
