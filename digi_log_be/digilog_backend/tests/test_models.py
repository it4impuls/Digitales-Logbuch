from django.test import TestCase#
from digilog_backend.models import Course, User, Attendee



# Create your tests here.
class CourseTest(TestCase):

    def setUp(self):
        self.host = User.objects.create(username = "test_user")

    def test_course_creation(self):
        course = Course.objects.create(
            host=self.host,
            title="Test course",
            level=Course.Level.BEGINNER,
            description_short="short description",
            content_list="content list",
            methods="methods",
            material="material",
            dates="dates",
        )
        self.assertEqual(course.host, self.host)
        self.assertEqual(course.title, "Test course")
        self.assertEqual(course.level, Course.Level.BEGINNER)
        self.assertEqual(course.description_short, "short description")
        self.assertEqual(course.content_list, "content list")
        self.assertEqual(course.methods, "methods")
        self.assertEqual(course.material, "material")
        self.assertEqual(course.dates, "dates")

    def test_course_update(self):
        course = Course.objects.create(
            host=self.host,
            title="Test course",
            level=Course.Level.BEGINNER,
            description_short="short description",
            content_list="content list",
            methods="methods",
            material="material",
            dates="dates",
        )
        course.title = "Test course updated"
        course.save()
        self.assertEqual(course.title, "Test course updated")

    def test_course_field_length(self):
        test_title = "a" * 100
        test_description_short = "a" * 100
        test_content_list = "a" * 100
        test_methods = "a" * 100
        test_material = "a" * 100
        test_dates = "a" * 100
        
        course = Course.objects.create(
            title=test_title,
            description_short=test_description_short,
            content_list=test_content_list,
            methods=test_methods,
            material=test_material,
            dates=test_dates,
            host=self.host
        )
        self.assertEqual(course.title, test_title)
        self.assertEqual(course.description_short, test_description_short)
        self.assertEqual(course.content_list, test_content_list)
        self.assertEqual(course.methods, test_methods)
        self.assertEqual(course.material, test_material)
        self.assertEqual(course.dates, test_dates)


class AttendeeTest(TestCase):
    def test_attendee_creation(self):
        attendee = User.objects.create(username="test_user")
        course = Course.objects.create(title="Test course", host=attendee)
        attendee_obj = Attendee.objects.create(
            attends=True,
            attendee=attendee,
            course=course,
        )
        self.assertEqual(attendee_obj.attends, True)
        self.assertEqual(attendee_obj.attendee, attendee)
        self.assertEqual(attendee_obj.course, course)
