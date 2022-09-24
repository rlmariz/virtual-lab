import sympy
import numpy
from sympy import *
from sympy.printing.theanocode import theano_function
from sympy.utilities.autowrap import ufuncify

s = sympy.symbols('s') 
t = sympy.symbols('t', positive=True)
#w = sympy.symbols('w', real = True)

expression1 = 8/(8*s**2+s)
print(expression1)
il = sympy.inverse_laplace_transform(expression1, s, t)
print(il)
print(il.subs(t, 1).evalf())


# from sympy.parsing.sympy_parser import parse_expr, standard_transformations, implicit_multiplication_application, convert_xor
# transformations = (standard_transformations + (implicit_multiplication_application,) + (convert_xor,))
# expr = parse_expr("8/(8*s**2+s)",  transformations=transformations)
# print(expr)
# il = sympy.inverse_laplace_transform(expr, s, t)
# print(il.subs(t, 10).evalf())

expression2 = sympy.parse_expr('8/(8*s**2+s)')
print(expression2)
il = sympy.inverse_laplace_transform(expression2, s, t)
print(il)
print(il.subs(t, 1).evalf())

assert str(expression1) == str(expression2)

print(expression1.args)
print(expression2.args)
assert expression1 == expression1
# s, t = sympy.symbols('s, t', positive=True)
# w = sympy.symbols('w', real = True)
# expression = sympy.parse_expr('8/(8*s**2+s)')
# itf = sympy.inverse_laplace_transform(expression, s, t)        
# itf.subs(t, 1).evalf()