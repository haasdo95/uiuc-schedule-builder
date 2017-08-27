import asyncio

import aiohttp

'''this class is for getting all the course info for one course(including all sections info, instructor...etc)'''


class xml_gettter:
    def __init__(self):
        self.task = []
        self.sem = asyncio.Semaphore(20)

    async def wrapper(self, addr):
        s = aiohttp.ClientSession()
        async with self.sem:
            async with s.get(addr) as response:
                t = await response.text()
                s.close()
                return t

    def addGetContentCoroutine(self, addr):
        self.task.append(asyncio.ensure_future(self.wrapper(addr)))

    def run_getter(self):
        loop = asyncio.get_event_loop()
        results = loop.run_until_complete(asyncio.gather(*(self.task)))
        return results

# =================================time test====================================
# x = xml_gettter()
# x.addGetContentCoroutine('https://courses.illinois.edu/cisapp/explorer/schedule/2018/spring/CS.xml')
# x.addGetContentCoroutine('https://courses.illinois.edu/cisapp/explorer/schedule/2017/spring/CS.xml')
# x.addGetContentCoroutine('https://courses.illinois.edu/cisapp/explorer/schedule/2016/spring/CS.xml')
# x.addGetContentCoroutine('https://courses.illinois.edu/cisapp/explorer/schedule/2015/spring/CS.xml')
# x.addGetContentCoroutine('https://courses.illinois.edu/cisapp/explorer/schedule/2014/spring/CS.xml')
# start = time.time()
# print(x.run_getter())
# print('5 aio requests: ', time.time() - start, 's')
# x = xml_gettter()
# x.addGetContentCoroutine('https://courses.illinois.edu/cisapp/explorer/schedule/2018/spring/CS.xml')
# start = time.time()
# print(x.run_getter())
# print('1 aio requests: ', time.time() - start, 's')
