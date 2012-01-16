#!/usr/bin/env python
# -*- coding: UTF-8 -*-
#from appengine_twitter import AppEngineTwitter
from google.appengine.api import users
from google.appengine.ext import webapp
from  google.appengine.api import memcache
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.api import urlfetch
import simplejson
#from pkg import sample

class MainPage(webapp.RequestHandler):
    
    def get(self):
        p=self.request.get("page")
        s=self.request.get("size")
        k=self.request.get("keywords")
        url='http://dajare-api.appspot.com/find/?page=%s&size=%s' % (p, s)
        if k:
            url += '&keywords=%s' % k
        u = urlfetch.fetch(url)
        #a = sample;
        #print a
        #s = simplejson.loads(a.content)
        self.response.out.write(u.content)
        


application = webapp.WSGIApplication([('/pkgs', MainPage)], debug=True)


def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
