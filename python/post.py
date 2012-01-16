#!/usr/bin/env python
# -*- coding: UTF-8 -*-
#from appengine_twitter import AppEngineTwitter
from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
import logging
import time
import datetime
import os
import oauth
import simplejson
import urllib
#http://dajare1242.appspot.com/api/user/dajare/export/csv -> CSV data ftom 2011. 05.22
#from simple_cookie import Cookies
#from django.utils import simplejson
CONSUMER_KEY = 'wYsvS8ayj7qYhg6pqSaw'
CONSUMER_SECRET_KEY = 'WTV3omuX8JEkNg6QaEYQ4TbPfsLtkbtAZoDQdhmLQq0'
ACCESS_TOKEN = '324377882-2Y0RtbQ36VSQojVPfadRJpjMzVUKp4lo38QiSlJo'
ACCESS_TOKEN_SECRET = 'iOEEZ50B3i1if1JsOHrjFEIxOkf06ZlKorGw8cwR7w'


class PostPage(webapp.RequestHandler):
    def get(self):
        #print os.environ["HTTP_HOST"]
        #print os.environ['REMOTE_ADDR']
        callback_url = "http://%s:8080/" % os.environ["REMOTE_ADDR"]
        """for k, v in os.environ.items():
            print "%s=%s" % (k,v)"""
        client = oauth.TwitterClient(CONSUMER_KEY, CONSUMER_SECRET_KEY, None)
        m = self.request.get("m")
        type = self.request.get("type")
        message = m
        param = {'status': message}
        message = urllib.quote(message.encode("utf-8"));
        if(m!="" and type=="update"):
            try:
                res = client.make_request('http://api.twitter.com/1/statuses/update.json',
                                token=ACCESS_TOKEN,
                                secret=ACCESS_TOKEN_SECRET,
                                additional_params=param,
                                method='POST')
            except Exception, e:
                logging.error(e)
            if res.status_code != 200:
                logging.warning('Failed to post a message to twitter. status_code: %d' \
                            % res.status_code)
                self.response.out.write('Error Status:' + res.status_code)
                self.response.headers['Content-Type'] = 'application/json'
            self.response.out.write(res.content)
            
        
        """param = {'include_entities':'true'}
        if(query == u'public'):
            res = client.make_request('http://api.twitter.com/1/statuses/public_timeline.json',
                                  token=ACCESS_TOKEN,
                                  secret=ACCESS_TOKEN_SECRET)
        if(query == u'home'):
            res = client.make_request('http://api.twitter.com/1/statuses/user_timeline.json',
                                  token=ACCESS_TOKEN,
                                  secret=ACCESS_TOKEN_SECRET)
        # self.response.out.write("Hello %s %s" % (str(datetime.datetime.now()),'test page'))
        if( query != '' ):
            #self.response.out.write(res.status_code)
            #self.response.out.write(res.content)
            json = simplejson.loads(res.content)
            self.response.out.write(json[0]["text"])"""
application = webapp.WSGIApplication([('/post', PostPage)], debug=True)


def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
