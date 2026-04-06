export default function Input({ type, placeholder, value, onChange, name }) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full p-3 mb-4 rounded-md border outline-none focus:ring-2 focus:ring-blue-400"
        />
    );
}