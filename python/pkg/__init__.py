#!/usr/bin/env python
#-*- coding: UTF-8 -*-
from google.appengine.api import rdbms
from google.appengine.ext import db
from DajareCloud import *
class CloudSQL():
    _table=""
    _val={}
    def __init__(self, instance=None, database=None):
        conn=None
        if instance!=None and database!=None:
            self.conn=rdbms.connect(instance, database)
            #self.cursor=conn.cursor()
    def CreareTables(self, Tables=None, Columns=None):
        pass
    def create(self, table_name, column):
        self.cursor=self.conn.cursor()
        sql = 'CREATE TABLE IF NOT EXISTS %s (%s)' % (table_name, ",".join(column))
        self.cursor.execute(sql)
        self.cursor.close()
    def select( self, column=None, table=None, option=None ):
        self.cursor=self.conn.cursor()
        self.table=table
        if option is None:
            option = ''
        _sql='SELECT %s from %s %s' % (column, table, option)
        #print _sql
        self.cursor.execute(_sql)
        val=self.cursor.fetchall()
        self.cursor.close()
        #return _sql
        return val
    def update(self, column=None, data=None, fetch=None, option=None):
        self.cursor=self.conn.cursor()
        str=""
        if len(column)==len(data):
            for i,v in enumerate(column):
                str += v+'='+"'"+data[i]+"',"
        else:
            return False
        _sql='UPDATE %s SET %s %s' % (self.table, str[0:-1], option)
        #return _sql
        self.cursor.execute(_sql)
        self.cursor.close()
        
    def insert(self,column=None,table=None,data=None):
        self.cursor=self.conn.cursor()
        col=','.join(column)
        #d=','.join(data)
        str = ""
        for d in data:
            str += '"' + d + '",'
        _sql='INSERT INTO %s (%s) VALUES (%s)' % ( self.table, col, str[0:-1] )
        self.cursor.execute(_sql)
        self.cursor.close()
        
    def close(self):
        self.cursor.close()
    

class PkgTest:
    def __init__(self):
        self.name="__module__"
        
class AuthToken(db.Model):
    pass

def AuthTokenDelete():
    count=AuthToken.all().count()
    if count > 0:
        token = AuthToken.all()
        f=token.fetch(count)
        for r in f:
            r.delete()
    return AuthToken.all().count()

def GetGMT(hour=None):
    if(hour is None):
        hour=9
    tz=datetime.timedelta(hours=hour)
    return datetime.datetime.today() + tz