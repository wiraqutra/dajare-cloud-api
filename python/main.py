#!/usr/bin/env python
# -*- coding: UTF-8 -*-

#from google.appengine.api import users
from google.appengine.api import memcache
from google.appengine.ext import db #from Big Table
from google.appengine.api import rdbms #from Google Cloud SQL
from google.appengine.ext import webapp
from google.appengine.api import urlfetch
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext.webapp import template
import os,simplejson,types,urllib2,oauth
from pkg import *
#from pkg.DajreCloud import *
dc = DajareCloud()
#cs = CloudSQL(instance='dajaremockupdb:dajare1242',database='dajare1242')
class MainPage(webapp.RequestHandler):
    def post(self):
        self.response.headers['Content-Type'] = 'text/html'
        client=oauth.TwitterClient(dc.keys["twitter"]["CONSUMER_KEY"], dc.keys["twitter"]["CONSUMER_SECRET_KEY"], None)
        cs = CloudSQL(instance='dajaremockupdb:dajare1242',database='dajare1242')
        id=self.request.cookies.get("dajare1242_id", "").encode("utf-8")
        user=cs.select(table='userdb', column='*', option='WHERE id=%s' % id)
        access_token=user[0][3]
        access_token_secret=user[0][4]
        message=self.request.get("tw")
        if message is "":
            self.redirect("/")
        param = {'status': message}
        tweet=cs.select(table='user_tweet', column='*', option='WHERE uid="%s" AND tweet="%s"' % (id.encode("utf-8"), message.encode("utf-8")))
        if str(len(tweet))=="0":
            data=( id.encode("utf-8"), message.encode("utf-8") )
            cs.insert(column=("uid", "tweet"), data=data)
            res=client.make_request('http://api.twitter.com/1/statuses/update.json',
                                token=access_token,
                                secret=access_token_secret,
                                additional_params=param,
                                method='POST')
        else:
            self.response.out.write('投稿済み')
        self.redirect("/")
        
    def get(self):
        cs = CloudSQL(instance='dajaremockupdb:dajare1242',database='dajare1242')
        self.response.headers['Content-Type'] = 'text/html'
        url="http://dajare-api.appspot.com/find/?page=1&size=20"
        callback_url = "http://%s/oauth_callback" % (os.environ["HTTP_HOST"])
        id=self.request.cookies.get("dajare1242_id", "").encode("utf-8")
        prefix="dajare1242_"
        expires=60*60*24
        self.response.headers.add_header('Set-Cookie', '%s=%s; expires=%s; PATH=/;' % (prefix+"redirect_uri", urllib2.quote(os.environ["PATH_INFO"]), expires))
        client=None
        user=None
        tv={}
        '''
        
        '''
        #　http://kizasi.jp/rss.xml
        #　xml=urlfetch.fetch(url='http://kizasi.jp/rss.xml')
        t={}
        j={}
        try :
            t=urlfetch.fetch(url=url)
            j = simplejson.loads(t.content)
        except DeadlineExceededError:
            self.response.out.write("DeadlineExceededError");
            return False
        if len(t.content) <= 1:
            return False
        
        tv["json"]=j
        tv["signin"]=0
        if id=="":
            client = oauth.TwitterClient(dc.keys["twitter"]["CONSUMER_KEY"], dc.keys["twitter"]["CONSUMER_SECRET_KEY"], callback_url)
        else:
            tv["signin"]=1
            tv["id"]=id
            op='WHERE id="%s"' % (id)
            tbl='userdb'
            tv["user_tmp"]=cs.select(table=tbl, column='*', option=op)
            tv["user"]=tv["user_tmp"][0]
        if client is not None:
            tv["oauthUrl"]=client.get_authorization_url()
        #
        """
            ランキング処理
        """
        url="http://dajare-api.appspot.com/rank/?page=1&size=5"
        t={}
        j={}
        try :
            t=urlfetch.fetch(url=url)
            j = simplejson.loads(t.content)
            results=j["results"][0:10]
            j["results"]=results
            tv["rank"]=j
        except DeadlineExceededError:
            self.response.out.write("DeadlineExceededError");
            return
        #self.response.out.write(results[0:20]["createDate"])
        tv["rank"]=j
        # self.response.out.write(t.content)
        # http://http://dajare-api.appspot.com/?page=1&size=20
        tmpl_path = os.path.dirname(__file__)+"/tmpl/"
        path = os.path.join(tmpl_path, 'index.tmp')
        #self.response.out.write(template.render(path, []))
        self.response.out.write(template.render(path, tv))
"""
    ダジャレStatus表示
"""
class FramePage(webapp.RequestHandler):
    def get(self):
        cs = CloudSQL(instance='dajaremockupdb:dajare1242',database='dajare1242')
        self.response.headers['Content-Type'] = 'text/html'
        callback_url = "http://%s/oauth_callback" % (os.environ["HTTP_HOST"])
        id=self.request.cookies.get("dajare1242_id", "").encode("utf-8")
        prefix="dajare1242_"
        expires=60*60*24
        self.response.headers.add_header('Set-Cookie', '%s=%s; expires=%s; PATH=/;' % (prefix+"redirect_uri", urllib2.quote(os.environ["PATH_INFO"]), expires))
        # print self.request.cookies.get("dajare1242_redirect_uri", "").encode("utf-8")
        """
        for k, v in os.environ.items():
            print "%s=%s" % (k,v)
        """
        client=None
        user=None
        tv={}
        tv["signin"]=0
        if id=="":
            client = oauth.TwitterClient(dc.keys["twitter"]["CONSUMER_KEY"], dc.keys["twitter"]["CONSUMER_SECRET_KEY"], callback_url)
        else:
            tv["signin"]=1
            tv["id"]=id
            tbl='userdb'
            tv["user_tmp"]=cs.select(table=tbl, column='*', option='WHERE id="%s"' % str(tv["id"]))
            tv["user"]=tv["user_tmp"][0]
        if client is not None:
            tv["oauthUrl"]=client.get_authorization_url()
        pid=None
        #id=self.request.get("id")
        if pid is None:
            pid=os.environ["PATH_INFO"].split("/")[2]
        url="http://dajare-api.appspot.com/find/"+pid
        t = urlfetch.fetch(url=url)
        j = simplejson.loads(t.content)
        
        tv["invild_flag"]=False
        if type(j["results"]) is types.DictionaryType:
            tv["json"]=j["results"]
            tv["invild_flag"]=True
            tv["host"]="http://%s%s" % (os.environ["HTTP_HOST"],os.environ["PATH_INFO"])
            tv["fb"]=urllib2.unquote(tv["host"])
        tmpl_path = os.path.dirname(__file__)+"/tmpl/"
        fileName='frame.tmp'
        path = os.path.join(tmpl_path, fileName)
        self.response.out.write(template.render(path, tv))
        
class SearchPage(webapp.RequestHandler):
    def get(self):
        cs = CloudSQL(instance='dajaremockupdb:dajare1242',database='dajare1242')
        self.response.headers['Content-Type'] = 'text/html'
        callback_url = "http://%s/oauth_callback" % (os.environ["HTTP_HOST"])
        id=self.request.cookies.get("dajare1242_id", "").encode("utf-8")
        q=self.request.get("q")
        p=self.request.get("p")
        prefix="dajare1242_"
        expires=60*60*24
        self.response.headers.add_header('Set-Cookie', '%s=%s; expires=%s; PATH=/;' % (prefix+"redirect_uri", '/', expires))
        tv={}
        tv["signin"]=0
        client=None
        if id=="":
            client = oauth.TwitterClient(dc.keys["twitter"]["CONSUMER_KEY"], dc.keys["twitter"]["CONSUMER_SECRET_KEY"], callback_url)
        else:
            tv["signin"]=1
            tv["id"]=id
            tv["user_tmp"]=cs.select(table='userdb', column='*', option='WHERE id="%s"' % str(tv["id"]))
            tv["user"]=tv["user_tmp"][0]
        if client is not None:
            tv["oauthUrl"]=client.get_authorization_url()
        if q is "":
            if len(os.environ["PATH_INFO"].split("/"))==3:
                q=os.environ["PATH_INFO"].split("/")[3]
            #print len(os.environ["PATH_INFO"].split("/"))
            #
        if p is "":
            p="1"
        # self.response.out.write(q)
        url="http://dajare-api.appspot.com/find/?size=100&keyword="+q+"&page="+p
        """
            POSTのみ対応、また
        """
        t = urlfetch.fetch(url=url)
        j = simplejson.loads(t.content)
        page = 0
        if j["allTotal"] is not 0 and j["total"] is not 0:
            page = j["allTotal"] / j["total"]
        tv["json"]=j
        tv["words"]=urllib2.unquote(q)
        tv["allTotal"] = j["allTotal"]
        tv["page"] = range(page)
        #self.response.out.write(page)
        # http://http://dajare-api.appspot.com/?page=1&size=20
        tmpl_path = os.path.dirname(__file__)+"/tmpl/"
        path = os.path.join(tmpl_path, 'search.tmp')
        # self.response.out.write(template.render(path, []))
        self.response.out.write(template.render(path, tv))
    def post(self):
        self.get()
        
class Fav(webapp.RequestHandler):
    url={
         "like":"http://dajare-api.appspot.com/iine/",
         "get_like":"http://dajare-api.appspot.com/find/"
    }
    keys={
         "dajare-cloud":"",
         "internal":"7C23654DEF84EF990D00C67C5CD5AA183607649A"
    }
    def __init__(self):
        pass
    def get(self):
        self.response.headers['Content-Type'] = 'text/html'
        id=None
        twid=self.request.cookies.get("dajare1242_id","")        
        if id is None:
            id=os.environ["PATH_INFO"].split("/")[2]
        if twid is None:
            pass
        #GET
        url=self.url["like"]+"?id="+id+"&twid="+twid
        t = urlfetch.fetch(url=url)
        self.response.out.write(t.content)

    def post(self):
        self.response.headers['Content-Type'] = 'text/html'
        id=None
        twid=self.request.cookies.get("dajare1242_id","")        
        if id is None:
            id=os.environ["PATH_INFO"].split("/")[2]
        url=self.url["like"]+"?id="+id+"&key="+self.keys["internal"]+"&twid="+twid
        t = urlfetch.fetch(url=url)
        self.response.out.write(t.content)
class GetLike(webapp.RequestHandler):
    url={
         "fav":"http://dajare-api.appspot.com/get_iine/"
    }
    key={
         "dajare-cloud":"",
         "internal":"7C23654DEF84EF990D00C67C5CD5AA183607649A"
    }
    def __init__(self):
        pass
    def get(self):
        self.response.headers['Content-Type'] = 'text/html'
        id=None
        if id is None:
            id=os.environ["PATH_INFO"].split("/")[2]
        url="http://dajare-api.appspot.com/find/?id="+id
        t = urlfetch.fetch(url=url)
        like = simplejson.loads(t.content)
        tv={}
        tv["like"] = like
        #self.response.out.write(j)
        #self.redirect("/status/"+id)
        tmpl_path = os.path.dirname(__file__)+"/tmpl/"
        path = os.path.join(tmpl_path, 'like.tmp')
        # self.response.out.write(template.render(path, []))
        self.response.out.write(template.render(path, tv))

class AuthToken(db.Model):
    pass

class CallBack(webapp.RequestHandler):
    """_instanse='dajaremockupdb:dajare1242'
    _database='dajare1242'"""
    def __init__(self):
        pass
    def get(self):
        cs = CloudSQL(instance='dajaremockupdb:dajare1242',database='dajare1242')
        (oauth_token,oauth_verifier) = (self.request.get("oauth_token"), self.request.get("oauth_verifier"))
        if self.request.get("denied") is not "":
            #print self.request.get("denied")
            self.redirect("/");
            return False
        client = oauth.TwitterClient(dc.keys["twitter"]["CONSUMER_KEY"], dc.keys["twitter"]["CONSUMER_SECRET_KEY"], None)
        user_info = client.get_user_info(oauth_token, oauth_verifier)
        prefix="dajare1242_"
        
        self.response.headers.add_header('Set-Cookie', '%s=%s;' % (prefix+"id", user_info["id"]))
        #cs.create('userdb', ['user_name VARCHAR(255)', 'service VARCHAR(255)', 'picture TEXT', 'token TEXT', 'secret TEXT', 'id VARCHAR(255)'])
        op='WHERE id="%s"' % user_info["id"]
        tbl='userdb'
        user=cs.select(table=tbl, column='*', option=op)
        #self.response.out.write(user)
        #return False
        if str(len(user)) is "0":
            # Add User
            data=(user_info["username"], user_info["service"], user_info["picture"], user_info["token"], user_info["secret"], str(user_info["id"]) )
            cs.insert(column=("user_name", "service", "picture", "token", "secret", "id"), data=data)
        elif str(len(user)) is "1":
            '''
                Update Profile
            '''
            sql=cs.update(
                          column=["user_name","token","secret"],
                          data=[user_info["username"],user_info["token"],user_info["secret"]],
                          option=' WHERE id="%s"' % (str(user_info["id"]))
                        )
        AuthTokenDelete()
        uri=self.request.cookies.get("dajare1242_redirect_uri","")
        #print uri
        if uri is not "":
            search_word=self.request.cookies.get("dajare1242_search_word","")
            if search_word is not "":
                uri = uri+'?q='+search_word
            self.redirect(uri)
        else:
            self.redirect("/")
class Robots(webapp.RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/plane'
application = webapp.WSGIApplication([
                                      ('/', MainPage),
                                      ('/oauth_callback', CallBack),
                                      ('/robots*', Robots),
                                      ('/wall.*', MainPage),
                                      ('/status.*', FramePage),
                                      ('/fav.*', Fav),
                                      ('/like.*', GetLike),
                                      ('/search.*', SearchPage)
                                      ], debug=True)

def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
