import useAvatar from '../hooks/useAvatar';

const AvatarUploader = () => {
    const { handleFileChange, avatarUrl } = useAvatar();

    return (
        <div>
            <label htmlFor="avatar-upload" className="cursor-pointer">
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="inline-block h-20 w-20 rounded-full mr-4"
                    />
                ) : (
                    <div className="hover:text-blue-700 text-blue-500 font-bold py-2 px-4 rounded">
                        Add photo
                    </div>
                )}
            </label>
            <input
                id="avatar-upload"
                type="file"
                onChange={handleFileChange}
                hidden
            />
        </div>
    );
};

export default AvatarUploader;
