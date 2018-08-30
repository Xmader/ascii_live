#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import json

pic_files = os.walk("pic").next()[-1]

def read(fn):
    fn = os.path.join("pic",fn)
    with open(fn,"r+") as f:
        t = f.read()
    return t

j = map(read,pic_files)

with open("pic.js","wb") as f:
    f.write("const pics = "+json.dumps(j))