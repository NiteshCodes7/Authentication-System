export default async function UserProfile({ params }: any) {
    return(
        <div className="flex flex-col justify-center items-center h-[100vh]">
            <h1>Profile</h1>
            <hr />
            <p className="text-4xl m-2">Profile Page <span className="p-2 rounded bg-orange-500 text-black">{await params.id}</span></p>
        </div>
    )
}