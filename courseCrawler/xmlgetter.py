import asyncio

import aiohttp


class XmlGetter:
    """
    This is the module to get response from multiple URLs.
    """

    def __init__(self):
        self.task = []
        self.sem = asyncio.Semaphore(20)

    async def wrapper(self, addr):
        """

        :param addr: the URL to target website
        :return: the source code of that website
        """
        s = aiohttp.ClientSession()
        async with self.sem:
            async with s.get(addr) as response:
                t = await response.text()
                s.close()
                return t

    def add_get_content_coroutine(self, addr):
        """

        :param addr: add a task to finish in the event loop
        """
        self.task.append(asyncio.ensure_future(self.wrapper(addr)))

    def run_getter(self):
        """

        :return: a list of result of tasks
        """
        loop = asyncio.get_event_loop()
        results = loop.run_until_complete(asyncio.gather(*self.task))
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
