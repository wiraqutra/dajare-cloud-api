'''
Created on 2011/12/20

@author: suga
'''
class AuthToken():
    pass
class DajareCloud():
    url={
         "search":"http://dajare-api.appspot.com/find/",
         "rank":"http://dajare-api.appspot.com/rank/",
         "iine":"http://dajare-api.appspot.com/iine/"
    }
    keys={
          "twitter":{"CONSUMER_KEY":"6lya2u9vmJNGtK73th7Uw",
                     "CONSUMER_SECRET_KEY":"Cv10jjaKIz4XPXtVh8pmW0ISIeLuxaGhTYRuDXocM"},
          "facebook":{"CONSUMER_KEY":"6lya2u9vmJNGtK73th7Uw",
                     "CONSUMER_SECRET_KEY":"Cv10jjaKIz4XPXtVh8pmW0ISIeLuxaGhTYRuDXocM"}
    }
    instanse='dajaremockupdb:dajare1242'
    database='dajare1242'
    def __init__(self):
        self.author=""
    def DeleteAuthToken(self):
        pass
        