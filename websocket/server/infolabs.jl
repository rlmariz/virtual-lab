#pkg> add InverseLaplace

module InfoLabs

using InverseLaplace
import InverseLaplace: talbot

export InfoLab;

mutable struct InfoLab
    tp::String
    name::String
    func::String
    func_invlap::Talbot

    Values;

    CalcInverseLaplace;
    CalcValue;

    function InfoLab() 
        this = new()

        this.Values = [];

        this.CalcInverseLaplace = function()
            f = eval(Meta.parse("f(s) = " * this.func));
            this.func_invlap = Talbot(f, 80);        
            nothing
        end

        this.CalcValue = function(time::Int)
            push!(this.Values, (time, this.func_invlap(time)))            
            nothing
        end        

        return this
     end
end

end