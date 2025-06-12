import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Building2, UserCheck, Eye, EyeOff } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { authAPI } from '../../services/api';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirm_password: '',
    role: '',
    full_name: '',
    phone: ''
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        // Login
        const response = await authAPI.login({
          email: formData.email,
          password: formData.password
        });
        
        // Store token and user data
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        toast({
          title: "Login Successful",
          description: `Welcome back, ${response.data.user.full_name}!`,
        });
        
        // Redirect based on role
        if (response.data.user.role === 'broker') {
          navigate('/broker-dashboard');
        } else {
          navigate('/builder-dashboard');
        }
      } else {
        // Signup
        if (formData.password !== formData.confirm_password) {
          toast({
            title: "Signup Failed",
            description: "Passwords do not match",
            variant: "destructive"
          });
          return;
        }
        
        if (!formData.role || !formData.full_name) {
          toast({
            title: "Signup Failed",
            description: "Please fill all required fields",
            variant: "destructive"
          });
          return;
        }
        
        const response = await authAPI.signup({
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirm_password,
          full_name: formData.full_name,
          phone: formData.phone,
          role: formData.role
        });
        
        // Store token and user data
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        toast({
          title: "Signup Successful",
          description: `Welcome, ${response.data.user.full_name}!`,
        });
        
        // Redirect based on role
        if (response.data.user.role === 'broker') {
          navigate('/broker-dashboard');
        } else {
          navigate('/builder-dashboard');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: isLogin ? "Login Failed" : "Signup Failed",
        description: error.response?.data?.detail || "An error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (role) => {
    if (role === 'broker') {
      setFormData({
        ...formData,
        email: 'broker@example.com',
        password: 'password'
      });
    } else {
      setFormData({
        ...formData,
        email: 'builder@example.com',
        password: 'password'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-in fade-in-50 duration-500">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Building2 className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              RealEstate Pro
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Comprehensive solution for real estate professionals
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-blue-800 text-sm">Demo Credentials</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => fillDemoCredentials('broker')}
              className="flex items-center space-x-1 text-xs hover:bg-blue-100"
            >
              <UserCheck className="h-3 w-3" />
              <span>Broker</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => fillDemoCredentials('builder')}
              className="flex items-center space-x-1 text-xs hover:bg-blue-100"
            >
              <Building2 className="h-3 w-3" />
              <span>Builder</span>
            </Button>
          </div>
        </div>

        {/* Auth Form */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {isLogin ? 'Welcome back' : 'Create account'}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin ? 'Sign in to your account' : 'Sign up to get started'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                      required={!isLogin}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="confirm_password">Confirm Password</Label>
                    <Input
                      id="confirm_password"
                      name="confirm_password"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirm_password}
                      onChange={handleInputChange}
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                      required={!isLogin}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Select Your Role</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, role: 'broker'})}
                        className={`p-4 border rounded-lg transition-all duration-200 hover:shadow-md ${
                          formData.role === 'broker' 
                            ? 'border-blue-500 bg-blue-50 shadow-md' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <UserCheck className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                        <div className="text-sm font-medium">Broker</div>
                        <div className="text-xs text-gray-500">Property sales</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, role: 'builder'})}
                        className={`p-4 border rounded-lg transition-all duration-200 hover:shadow-md ${
                          formData.role === 'builder' 
                            ? 'border-blue-500 bg-blue-50 shadow-md' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Building2 className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                        <div className="text-sm font-medium">Builder</div>
                        <div className="text-xs text-gray-500">Project management</div>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {isLogin && (
                <div className="flex items-center justify-between">
                  <Label></Label>
                  <Button variant="link" className="text-sm text-blue-600 hover:text-blue-800">
                    Forgot password?
                  </Button>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
                size="lg"
                disabled={loading}
              >
                {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-sm text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </span>
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-blue-600 hover:text-blue-800 ml-1"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          © 2025 RealEstate Pro. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default AuthPage;