
from django.test import TestCase
from django.contrib.auth.models import User
from digilog_backend.models import Course, User
import json



class TestViews(TestCase):
    """
    Tests for views
    """
    def setUp(self):
        """
        Set up test data
        """
        self.user = User.objects.create_user(username="testuser", password="testpassword")
        self.host = User.objects.create_user(username="testhost", password="testpassword")
        self.course = Course.objects.create(title="testcourse", description_short="testdescription", duration=3, host=self.host)

    def test_login_view(self):
        """
        Test login view
        """
        data = {
            'username': 'testuser',
            'password': 'testpassword'
        }
        response = self.client.post('/api/token/', data)
        data = json.loads(response.content)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['uname'], 'testuser')
        self.assertTrue('access' in data)
        self.assertTrue('refresh' in data)

    def test_attendee_list(self):
        """
        Test attendee list view
        """
        # self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.user.auth_token.key)
        response = self.client.get('/api/attendees/')
        self.assertEqual(response.status_code, 200)

    def test_course_list(self):
        """
        Test course list view
        """
        response = self.client.get('/api/courses/')
        self.assertEqual(response.status_code, 200)

    def test_login_view_with_invalid_credentials(self):
        """
        Test login view with invalid credentials
        """
        data = {
            'username': 'invaliduser',
            'password': 'invalidpassword'
        }
        response = self.client.post('/api/token/', data)
        self.assertEqual(response.status_code, 401)

    def test_login_view_no_data(self):
        """
        Test login view with no data
        """
        data = {}
        response = self.client.post('/api/token/', data)
        self.assertEqual(response.status_code, 400)

    def test_myTokenrefreshView(self):
        """
        Test myTokenrefreshView
        """
        data = {
            'username': 'testuser',
            'password': 'testpassword'
        }
        response = self.client.post('/api/token/', data)
        data = json.loads(response.content)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['uname'], 'testuser')
        self.assertTrue('access' in data)
        self.assertTrue('refresh' in data)

        response = self.client.get('/api/token/refresh/', headers={'refresh': data['refresh']})
        data = json.loads(response.content)
        self.assertTrue("access" in data)
        self.assertEqual(response.status_code, 200)

