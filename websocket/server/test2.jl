using InverseLaplace
import InverseLaplace: talbot

f = eval(Meta.parse("f(s) = (8 / (8s + 1))*1/s"));
func_invlap = Talbot(f, 80);        
println(func_invlap);
println(func_invlap(1));

@async begin
    println(func_invlap(1));
end

println("teste2")

nothing