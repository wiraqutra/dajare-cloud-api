#!/usr/bin/env python
# -*- coding: UTF-8 -*-
from google.appengine.api import users
from google.appengine.api import memcache
from google.appengine.ext import db
from google.appengine.ext import webapp
from google.appengine.api import urlfetch
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext.webapp import template
import os,simplejson,types,urllib2
import oauth

class DajareCloud():
    url={
         "search":"http://dajare-api.appspot.com/find/",
         "rank":"http://dajare-api.appspot.com/rank/",
         "iine":"http://dajare-api.appspot.com/iine/"
    }
    def __init__(self):
        pass
    

class PostMension(webapp.RequestHandler):
    CONSUMER_KEY = '6lya2u9vmJNGtK73th7Uw'
    CONSUMER_SECRET_KEY = 'Cv10jjaKIz4XPXtVh8pmW0ISIeLuxaGhTYRuDXocM'
    ACCESS_TOKEN = '304706129-JBQSjZkVjyZNRgIuzDC8QdhJhPVpYacfJZ7lGcMg'
    ACCESS_TOKEN_SECRET = 'rrepH1Me7qIK5P7Njw0pPgxnflBorBu8tarptbJ4A'
    url="http://dajare-api.appspot.com/find/"
    def get(self):
        import random
        client = oauth.TwitterClient(self.CONSUMER_KEY, self.CONSUMER_SECRET_KEY, None)
        t = urlfetch.fetch(url=self.url)
        j = simplejson.loads(t.content)
        r=random.randint(1,len(j["results"])-1)
        str=u"%s %s 「%s」" % (u"",u"ダジャレで人を幸せにすることを目指し、日々収集中〜 http://goo.gl/KIVPF", j["results"][r]["text"])
        str=str[0:145]
        #j["results"][r]["idText"]
        
        param = {'status': str.encode("utf-8")}
        res = client.make_request('http://api.twitter.com/1/statuses/update.json',
                                token=self.ACCESS_TOKEN,
                                secret=self.ACCESS_TOKEN_SECRET,
                                additional_params=param,
                                method='POST')
        self.response.out.write('')

application = webapp.WSGIApplication([
                                      ('/tweet.*', PostMension)
                                      ], debug=True)


def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
