from html.parser import HTMLParser
import json

class CourseSection:
    def __init__(self):
        self.code = ""
        self.id = 0
        self.section = ""
        self.name = ""
        self.instructor = ""
        self.location = ""
        self.days = [] 
        self.times = [] 
    
    def __eq__(self, other):
        return \
        self.code == other.code and \
        self.id == other.id and \
        self.section == other.section and \
        self.name == other.name and \
        self.instructor == other.instructor and \
        self.location == other.location and \
        self.days == other.days and \
        self.times == other.times

    def to_dict(self):
        return \
        {
            "code" : self.code,
            "id" : self.id,
            "section" : self.section,
            "name" : self.name,
            "instructor" : self.instructor,
            "location" : self.location,
            "days" : self.days,
            "times" : self.times,
        }



class WorkdayParser(HTMLParser):
    def __init__(self):
        HTMLParser.__init__(self) 
        self.sections_list = []
        self.element_stack = [["", [], ""]]
        self.working_section = CourseSection()
        self.indent_level = 0
        self.in_courses = False

    def handle_starttag(self, tag, attrs):
        self.element_stack.append([tag, attrs, ""])
        if (tag == "li" and ("id", "wd-CompositeWidget-6$8104") in attrs):
            self.sections_list.append(self.working_section.to_dict())
            self.working_section = CourseSection()
            #print("")

    def handle_data(self, data):
        self.element_stack[-1][2] = data 
        if (data == "2044 Results"):
            self.in_courses = True

    def handle_endtag(self, tag):
        #print(self.element_stack.pop())
        if self.in_courses and self.element_stack[-1][0] == "div" and \
            ("class", "gwt-Label WOPO WHOO") in self.element_stack[-1][1] and \
            ("data-automation-id", "promptOption") in self.element_stack[-1][1]:
            if ":" in self.element_stack[-1][2]:
                self.deconstruct_three(self.element_stack[-1][2]) 

            elif "-" in self.element_stack[-1][2]:
                self.deconstruct_one(self.element_stack[-1][2]) 

        elif self.element_stack[-1][0] == "span" and\
            ("class", "gwt-InlineLabel WDVF WCUF") and \
            "|" in self.element_stack[-1][2]:
            self.deconstruct_two(self.element_stack[-1][2]) 
    
    def deconstruct_one(self, data):
        #print(data)
        self.working_section.code = data[:data.index(" ")].strip()
        self.working_section.id = data[data.index(" "):data.index("-")].strip()
        self.working_section.section = data[data.index("-") + 1:data.rindex("-")].strip()
        self.working_section.name = data[data.rindex("-") + 2:].strip()

    def deconstruct_two(self, data):
        data = data.split("|")
        self.working_section.instructor = ("" if len(data) < 3 else data[2]).strip()

    def deconstruct_three(self, data):
        data = data.split("|")
        #print(data)
        self.working_location = ("" if len(data) < 1 else data[0])
        for day in "" if len(data) < 2 else data[1].split(","):
            day = day.strip()
            self.working_section.days.append("H" if day[1] == "h" else day[0])
        if "/" not in data[-1]:
            for time in "" if len(data) < 3 else data[2].split("-"):
                self.working_section.times.append(WorkdayParser.time_str_to_min(time.strip()))

    def time_str_to_min(time):
        ret = int(time[:time.index(":")]) * (1 if time[time.index(" "):time.index("M")] == "A" else 2) * 60
        ret += int(time[time.index(":") + 1:time.index(" ")])
        return ret

parser = WorkdayParser()
parser.feed(open("every2025classonworkday.html", "r").read())
print(json.dumps(parser.sections_list, indent=4))
