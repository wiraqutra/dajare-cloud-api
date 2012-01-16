#!/usr/bin/env python
# -*- coding: UTF-8 -*-
#from appengine_twitter import AppEngineTwitter
from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
import datetime
class TimesPage(webapp.RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/html'
        
        self.response.out.write("Hello %s %s" % (str(datetime.datetime.now()),'test page'))
        #self.response.out.write(user)z
application = webapp.WSGIApplication([('/script1', TimesPage)], debug=True)


def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
