const getGithubRepos = async()=>{
    const response = await fetch(`https://api.github.com/users/MrDharn/repos`);
    if(!response.ok){
        throw new Error("Failed to fetch repositories")
    }

    return await response.json();
}

module.exports = getGithubRepos