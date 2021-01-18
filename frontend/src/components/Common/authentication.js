import Cookies from "js-cookie";


const check_auth= (props,type)=>
{
    console.log(Cookies.get('id'),Cookies.get('userid'),Cookies.get('type'),Cookies.get('prof_built'),type)
    if(!(Cookies.get('id') && Cookies.get('userid') && Cookies.get('type') &&Cookies.get('prof_built') && (Cookies.get('type')===type))){
        Cookies.remove('id');
        Cookies.remove('userid');
        Cookies.remove('type');
        Cookies.remove('prof_built')
        alert("User is not authorized to view this page.Sign-in and try again")
        props.history.push('/')
    }
    else if(Cookies.get('prof_built') === false)
    {
        alert("Profile not built yet")
        if(type ==='applicant')
        {
            props.history.push('/profile')
        }
        else
        {
            props.history.push('/recruiter/profile')
        }

    }
}

export default check_auth
