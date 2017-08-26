import requests
from bs4 import BeautifulSoup
from json_dumper import json_dumper

r = requests.get('https://courses.illinois.edu/cisapp/explorer/schedule/2018/spring/CS/498.xml?mode=detail')
b = BeautifulSoup(r.text,'xml')
jsD = json_dumper(r.text)
jsD.dump('CS498.json')