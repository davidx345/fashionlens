from setuptools import setup, find_packages

setup(
    name="fashion_analysis",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        'Flask==3.1.0',
        'flask-cors==5.0.1',
        'python-dotenv==1.1.0',
        'pymongo==4.12.0',
        'pillow==11.1.0',
        'flask-jwt-extended==4.5.3',
        'passlib==1.7.4',
        'google-generativeai==0.3.2',
        'requests==2.31.0',
        'python-slugify==8.0.1',
        'icalendar==5.0.7',
        'google-auth==2.23.0',
        'google-auth-oauthlib==1.1.0',
        'google-api-python-client==2.97.0'
    ],
)