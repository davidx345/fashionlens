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
        'torch==2.2.0+cpu',
        'torchvision==0.17.0+cpu',
        'transformers==4.37.2'
    ],
)