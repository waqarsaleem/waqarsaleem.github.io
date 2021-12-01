function mappoint(P, Q , A ,B ,X ) 
{
    if( P.type != Q.type || A.type != B.type ){
        throw "mappoint: trying to interpolate incosistent types";
    }

    let alpha;
    let var1 = subtract( X, P);
    let var2 = subtract( Q, P);

    //FOLLOWING THE FORMULA GIVEN TO US IN THE LATEX
    alpha = length(var1)/length(var2);
    
    let out = mix( A, B, alpha );
    return out


}

function Compute_ZN(c, n_t)
{
    var z = vec2(0,0) ;  //INITIAL Z(O) 
    var iterations = 0;

    while (length(z) <= 2 && iterations < n_t) //LOOP TO CALCULATE OUR ESCAPE_TIME
    {
        if ( iterations === n_t)
        {
            return n_t;  //return max iterations if complex number does not escape
        }

        z = add( vec2( z[0]*z[0] - z[1] * z[1] , 2*z[0]*z[1]) , c) //Calculating value of complex number in madelbrot set
        iterations++;
    }
    return iterations; //NUMBER OF ITERATIONS = ESCAPE_TIME
}
