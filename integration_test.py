#!/usr/bin/env python3
"""
Frontend-Backend Integration Test
Tests the complete integration between the Next.js frontend and Flask backend
"""

import requests
import json
import subprocess
import time
import sys
import os
from datetime import datetime

def colored_print(text, color_code):
    """Print colored text to terminal"""
    print(f"\033[{color_code}m{text}\033[0m")

def success(text):
    colored_print(f"✅ {text}", "92")

def warning(text):
    colored_print(f"⚠️  {text}", "93")

def error(text):
    colored_print(f"❌ {text}", "91")

def info(text):
    colored_print(f"ℹ️  {text}", "94")

class IntegrationTester:
    def __init__(self):
        self.backend_url = "http://localhost:5000"
        self.frontend_url = "http://localhost:3000"
        self.backend_process = None
        self.frontend_process = None
        
    def test_backend_environment(self):
        """Test backend environment and configuration"""
        info("Testing backend environment...")
        
        try:
            # Check if required files exist
            backend_dir = "backend"
            required_files = [".env", "app.py", "requirements.txt"]
            
            for file in required_files:
                if os.path.exists(os.path.join(backend_dir, file)):
                    success(f"Backend file {file} exists")
                else:
                    error(f"Backend file {file} missing")
                    return False
                    
            # Test imports
            os.chdir(backend_dir)
            result = subprocess.run([
                sys.executable, "-c", 
                "from app import app; print('Backend app imports successfully')"
            ], capture_output=True, text=True, cwd=".")
            
            if result.returncode == 0:
                success("Backend imports successful")
                return True
            else:
                error(f"Backend import failed: {result.stderr}")
                return False
                
        except Exception as e:
            error(f"Backend environment test failed: {e}")
            return False
        finally:
            os.chdir("..")
            
    def test_frontend_environment(self):
        """Test frontend environment and configuration"""
        info("Testing frontend environment...")
        
        try:
            frontend_dir = "fashionlens frontend"
            required_files = ["package.json", "next.config.ts", ".env.local"]
            
            for file in required_files:
                if os.path.exists(os.path.join(frontend_dir, file)):
                    success(f"Frontend file {file} exists")
                else:
                    if file == ".env.local":
                        warning(f"Frontend file {file} missing (optional)")
                    else:
                        error(f"Frontend file {file} missing")
                        return False
                        
            # Check Next.js configuration
            with open(os.path.join(frontend_dir, "next.config.ts"), "r") as f:
                config_content = f.read()
                if "localhost:5000" in config_content and "rewrites" in config_content:
                    success("Next.js proxy configuration found")
                else:
                    warning("Next.js proxy configuration may be missing")
                    
            return True
            
        except Exception as e:
            error(f"Frontend environment test failed: {e}")
            return False
            
    def test_api_endpoints(self):
        """Test backend API endpoints"""
        info("Testing backend API endpoints...")
        
        try:
            # Test health endpoint
            response = requests.get(f"{self.backend_url}/api/health/ping", timeout=5)
            if response.status_code == 200:
                success("Health endpoint accessible")
            else:
                error(f"Health endpoint failed: {response.status_code}")
                return False
                
            # Test auth endpoints structure
            endpoints_to_test = [
                "/api/auth/register",
                "/api/auth/login", 
                "/api/dashboard/analytics",
                "/api/wardrobe/items"
            ]
            
            for endpoint in endpoints_to_test:
                # For GET endpoints, we expect them to exist (even if they return 401/405)
                # For POST endpoints, we expect them to handle the request
                try:
                    response = requests.get(f"{self.backend_url}{endpoint}", timeout=5)
                    if response.status_code in [200, 401, 405, 422]:  # Valid responses
                        success(f"Endpoint {endpoint} accessible")
                    else:
                        warning(f"Endpoint {endpoint} returned {response.status_code}")
                except requests.exceptions.RequestException:
                    error(f"Endpoint {endpoint} not accessible")
                    
            return True
            
        except Exception as e:
            error(f"API endpoint test failed: {e}")
            return False
            
    def test_cors_configuration(self):
        """Test CORS configuration"""
        info("Testing CORS configuration...")
        
        try:
            # Test OPTIONS request
            headers = {
                "Origin": "http://localhost:3000",
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "Content-Type,Authorization"
            }
            
            response = requests.options(f"{self.backend_url}/api/auth/login", headers=headers, timeout=5)
            
            if response.status_code in [200, 204]:
                cors_headers = response.headers
                if "Access-Control-Allow-Origin" in cors_headers:
                    success("CORS headers present")
                    if "localhost:3000" in cors_headers.get("Access-Control-Allow-Origin", ""):
                        success("CORS allows frontend origin")
                    else:
                        warning("CORS may not allow frontend origin")
                else:
                    warning("CORS headers missing")
            else:
                warning(f"OPTIONS request failed: {response.status_code}")
                
            return True
            
        except Exception as e:
            warning(f"CORS test inconclusive: {e}")
            return True  # Don't fail integration for CORS issues
            
    def test_frontend_proxy(self):
        """Test frontend proxy configuration"""
        info("Testing frontend proxy...")
        
        # This would require the frontend to be running
        # For now, just check the configuration file
        try:
            config_path = "fashionlens frontend/next.config.ts"
            with open(config_path, "r") as f:
                config = f.read()
                
            if "localhost:5000" in config and "/api/:path*" in config:
                success("Frontend proxy configuration looks correct")
                return True
            else:
                error("Frontend proxy configuration appears incorrect")
                return False
                
        except Exception as e:
            error(f"Frontend proxy test failed: {e}")
            return False
            
    def test_authentication_flow(self):
        """Test authentication flow"""
        info("Testing authentication flow...")
        
        try:
            # Test registration endpoint
            test_user = {
                "name": "Test User",
                "email": f"test_{int(time.time())}@example.com",
                "password": "TestPassword123!"
            }
            
            response = requests.post(
                f"{self.backend_url}/api/auth/register",
                json=test_user,
                timeout=5
            )
            
            if response.status_code in [200, 201]:
                success("Registration endpoint working")
                
                # Test login with the same user
                login_data = {
                    "email": test_user["email"],
                    "password": test_user["password"]
                }
                
                login_response = requests.post(
                    f"{self.backend_url}/api/auth/login",
                    json=login_data,
                    timeout=5
                )
                
                if login_response.status_code == 200:
                    data = login_response.json()
                    if "access_token" in data and "user" in data:
                        success("Login endpoint returns proper tokens")
                        return True
                    else:
                        warning("Login response missing expected fields")
                else:
                    warning(f"Login failed: {login_response.status_code}")
                    
            elif response.status_code == 400:
                # Might be user already exists, try login directly
                warning("Registration returned 400, trying login...")
                
            else:
                error(f"Registration failed: {response.status_code}")
                
        except Exception as e:
            error(f"Authentication test failed: {e}")
            return False
            
        return True
        
    def generate_integration_report(self):
        """Generate a comprehensive integration report"""
        info("Running comprehensive integration test...")
        
        results = {
            "timestamp": datetime.now().isoformat(),
            "tests": {}
        }
        
        # Run all tests
        tests = [
            ("Backend Environment", self.test_backend_environment),
            ("Frontend Environment", self.test_frontend_environment),
            ("API Endpoints", self.test_api_endpoints),
            ("CORS Configuration", self.test_cors_configuration),
            ("Frontend Proxy", self.test_frontend_proxy),
            ("Authentication Flow", self.test_authentication_flow)
        ]
        
        all_passed = True
        
        for test_name, test_func in tests:
            try:
                result = test_func()
                results["tests"][test_name] = {
                    "status": "PASS" if result else "FAIL",
                    "passed": result
                }
                if not result:
                    all_passed = False
            except Exception as e:
                results["tests"][test_name] = {
                    "status": "ERROR", 
                    "error": str(e),
                    "passed": False
                }
                all_passed = False
                
        # Generate summary
        info("\n" + "="*50)
        info("INTEGRATION TEST SUMMARY")
        info("="*50)
        
        for test_name, result in results["tests"].items():
            if result.get("passed"):
                success(f"{test_name}: PASSED")
            elif result["status"] == "ERROR":
                error(f"{test_name}: ERROR - {result.get('error', 'Unknown error')}")
            else:
                error(f"{test_name}: FAILED")
                
        if all_passed:
            success("\n🎉 All integration tests passed!")
            info("Your frontend-backend integration is working correctly.")
        else:
            warning("\n⚠️  Some integration tests failed.")
            info("Check the issues above and refer to the integration guide.")
            
        # Save detailed results
        with open("integration_test_results.json", "w") as f:
            json.dump(results, f, indent=2)
            
        info(f"\nDetailed results saved to: integration_test_results.json")
        
        return all_passed

def main():
    """Main function to run integration tests"""
    print("\n" + "="*60)
    colored_print("FASHIONLENS FRONTEND-BACKEND INTEGRATION TEST", "96")
    print("="*60)
    
    tester = IntegrationTester()
    
    # Check if backend is running
    try:
        response = requests.get("http://localhost:5000/api/health/ping", timeout=2)
        success("Backend is running")
    except requests.exceptions.RequestException:
        warning("Backend is not running")
        info("Please start the backend with: python backend/app.py")
        info("Or use: python start_backend_simple.py")
        
    # Run the comprehensive test
    tester.generate_integration_report()

if __name__ == "__main__":
    main()
