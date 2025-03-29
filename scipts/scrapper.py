import requests
from html.parser import HTMLParser
import json

class ScrapperHTMLParser(HTMLParser):

    def __init__(self):
        HTMLParser.__init__(self)
        self.course_attribs = \
        {
            "course_id" : "",
            "name" : "",
            "description" : "",
            "credits" : "",
            "prereqs" : [],
            "distri" : "",
        }

        self.tag_stack = []
        self.current_data = ""

    def handle_starttag(self, tag, attrs):
        #print("start tag: ", tag)
        self.tag_stack.append((tag, attrs))
        for attr in attrs:
            pass
            #print("\tattr: ", attrs)

    def handle_endtag(self, tag):
        #print("end tag: ", tag)
        if (tag == "span" and len(self.tag_stack) >= 2 and self.tag_stack[-2][0] == "h1"):
            self.course_attribs["course_id"] = self.current_data
        if (tag == "h1"):
            self.course_attribs["name"] = self.current_data
        if (len(self.tag_stack) >= 2 and ("class", "desc") in self.tag_stack[-2][1] and tag == "p"):
            self.course_attribs["description"] = self.current_data
        if (len(self.tag_stack) >= 1 and ("class", "credits") in self.tag_stack[-1][1]):
            self.course_attribs["credits"] = self.current_data
        if (len(self.tag_stack) >= 1 and any(("class", "sc_prereqs") in x[1] for x in self.tag_stack)):
            self.course_attribs["prereqs"].append(self.current_data)
        if (len(self.tag_stack) >= 1 and ("id", "distribution") in self.tag_stack[-1][1]):
            self.course_attribs["distri"] = self.current_data

        self.tag_stack.pop()
        

    def handle_data(self, data):
        #print(data)
        self.current_data = data.strip()

outfile = open("outfile.txt", "w")
all_stevens_classes = eval(open("allstevensclasses.txt", "r").read())

json_list = []

for link in all_stevens_classes:
    html_content = requests.get(link)
    html_parser = ScrapperHTMLParser()
    html_parser.feed(html_content.text)
    json_list.append(html_parser.course_attribs)

json.dump(json_list, outfile)

outfile.close()
all_stevens_classes.close()

"""
html_contents = requests.get('https://web.stevens.edu/catalog/archive/2024-2025/en/catalog/academic-catalog/courses/cm-construction-management/500/cm-529.html')

html_parser = ScrapperHTMLParser()
html_parser.feed(html_contents.text)
print("Final Dict of attribs")
print(html_parser.course_attribs)
"""
