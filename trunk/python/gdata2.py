#!/usr/bin/env python
# -*- coding: UTF-8 -*-

from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.api import urlfetch
from google.appengine.ext.webapp.util import run_wsgi_app
import logging
import time
import datetime
import csv
#import read
#import urllib2
#http://dajare1242.appspot.com/api/user/dajare/export/csv -> CSV data ftom 2011. 05.22
class CSVPage(webapp.RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/html;charset=utf-8;'
        url = u"http://dajare1242.appspot.com/api/user/dajare/export/csv"
        #url = u"http://ball-inc.co.jp/"
        result = urlfetch.fetch(url)
        #result = result = urllib2.urlopen(url)
        #if result.status_code == 200:
        #self.response.out.write(result.content)
        #data = csv.reader(result.content)
        count = 0
        # print result.content
        # self.response.out.write(data[0])
        c = {}
        try:
            #self.response.headers['Content-Type'] = 'text/tab-separated-values'
            #self.response.headers['Content-Disposition'] = 'attachement; filename=data.csv'
            #self.response.out.write(result.content)
            c = csv.reader(result.content)
            #for row in csv.reader(result.content):
                #if(count<10):
                    #print row
                    #for elem in row:
                        #self.response.out.write(elem + ",")
                #self.response.out.write("\n")
                #++count
                #self.response.out.write(count)
                #print count
        except Exception, e:
                logging.error(e)
        
application = webapp.WSGIApplication([('/csv', CSVPage)], debug=True)


def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
