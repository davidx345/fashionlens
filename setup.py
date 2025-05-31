from setuptools import setup, find_packages

setup(
    name="fashion_analysis",
    version="0.1.0",
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        # Add your backend dependencies here
        # e.g., 'Flask',
        # 'SQLAlchemy',
    ],
    entry_points={
        'console_scripts': [
            'fashion-analysis=backend.run:main',  # Example if you have a main function in run.py
        ],
    },
    author="Your Name",
    author_email="your.email@example.com",
    description="Backend for FashionLens application.",
    long_description=open('README.md').read(),
    long_description_content_type='text/markdown',
    url="https://github.com/yourusername/fashionlens",  # Replace with your project URL
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",  # Choose your license
        "Operating System :: OS Independent",
    ],
    python_requires='>=3.9',  # Specify your Python version requirement
)
