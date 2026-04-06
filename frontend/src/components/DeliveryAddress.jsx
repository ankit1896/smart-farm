import { useState, useEffect } from 'react';
import { MapPin, Plus, CheckCircle2, Loader2, Home, Briefcase, Map as MapIcon, ChevronRight, Info, Pencil } from 'lucide-react';

export default function DeliveryAddress({ onAddressChange, onConfirm, isConfirmed }) {
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedId, setSelectedId] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [confirmedAddress, setConfirmedAddress] = useState(null);

    const token = localStorage.getItem("access_token");

    // Fetch addresses from backend
    useEffect(() => {
        const fetchAddresses = async () => {
            if (!token) {
                setIsLoading(false);
                setIsAddingNew(true);
                return;
            }
            try {
                const response = await fetch("http://127.0.0.1:8000/api/addresses/", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setSavedAddresses(data);
                    if (data.length > 0) {
                        const defaultAddr = data.find(a => a.is_default) || data[0];
                        setSelectedId(defaultAddr.id);
                        handleSelect(defaultAddr);
                    } else {
                        // Keep isAddingNew false to follow user request "not directely form open"
                        setIsAddingNew(false);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch addresses:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAddresses();
    }, [token]);

    const [form, setForm] = useState({
        full_name: '',
        address_type: 'Home',
        phone: '',
        house_no: '',
        area: '',
        landmark: '',
        city: '',
        state: '',
        postal_code: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const updatedForm = { ...form, [name]: value };
        setForm(updatedForm);
        
        if (!isAddingNew) return;
        const fullAddress = `${updatedForm.house_no}, ${updatedForm.area}, ${updatedForm.city} - ${updatedForm.postal_code}`;
        onAddressChange(fullAddress, updatedForm);
    };

    const handleSelect = (addr) => {
        setSelectedId(addr.id);
        setIsAddingNew(false);
        setEditingId(null); // Clear editing if selecting
        const fullStr = `${addr.house_no || ''} ${addr.area || addr.address}, ${addr.city} (${addr.postal_code})`;
        onAddressChange(fullStr, addr);
        
        // Auto-confirm for immediate feedback (boolean selection true)
        setConfirmedAddress({
            name: addr.full_name,
            address: `${addr.house_no || ''}, ${addr.area || addr.address}, ${addr.city} (${addr.postal_code})`,
            pin: addr.postal_code
        });
        onConfirm(true);
    };

    const handleEdit = (addr) => {
        setEditingId(addr.id);
        setIsAddingNew(true);
        setForm({
            full_name: addr.full_name || '',
            address_type: addr.address_type || 'Home',
            phone: addr.phone || '',
            house_no: addr.house_no || '',
            area: addr.area || '',
            landmark: addr.landmark || '',
            city: addr.city || '',
            state: addr.state || '',
            postal_code: addr.postal_code || ''
        });
        // Scroll to form on mobile/small screens if needed
    };

    const handleSaveNewAddress = async () => {
        const fullAddressStr = `${form.house_no}, ${form.area}, ${form.landmark ? 'Near ' + form.landmark : ''}, ${form.city}, ${form.state} - ${form.postal_code}`;
        const payload = { ...form, address: fullAddressStr };

        if (!token) {
            setConfirmedAddress({
                name: form.full_name,
                address: fullAddressStr,
                pin: form.postal_code
            });
            onConfirm(true);
            return;
        }

        try {
            const url = editingId 
                ? `http://127.0.0.1:8000/api/addresses/${editingId}/` 
                : "http://127.0.0.1:8000/api/addresses/";
            const method = editingId ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const savedData = await response.json();
                // Update list and select it, but STAY in list view for "shown into address section"
                if (editingId) {
                    setSavedAddresses(savedAddresses.map(a => a.id === editingId ? savedData : a));
                    setEditingId(null);
                } else {
                    setSavedAddresses([...savedAddresses, savedData]);
                    setSelectedId(savedData.id); // Select new one
                }
                
                setIsAddingNew(false); // Go back to list view
                
                // Still notify parent of the selection
                onAddressChange(`${savedData.house_no || ''}, ${savedData.area || savedData.address}, ${savedData.city} (${savedData.postal_code})`, savedData);
            } else {
                const errorData = await response.json();
                console.error("Failed to save address:", errorData);
                alert("Failed to save address: " + JSON.stringify(errorData));
            }
        } catch (error) {
            console.error("Error saving address:", error);
            alert("Network error. Please try again.");
        }
    };

    if (isLoading) return (
        <div className="bg-white rounded-2xl p-16 border border-gray-100 flex flex-col items-center justify-center gap-4 text-blue-600 shadow-sm">
            <Loader2 className="animate-spin text-blue-500" size={40} />
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400">Securing your location...</p>
        </div>
    );

    const getTypeIcon = (type) => {
        if (type === 'Home') return <Home size={18} />;
        if (type === 'Work') return <Briefcase size={18} />;
        return <MapIcon size={18} />;
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-end justify-between">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Delivery Address</h2>
                    <div className="h-1.5 w-12 bg-blue-500 rounded-full mt-2"></div>
                </div>
                {savedAddresses.length > 0 && !isConfirmed && (
                    <button 
                        onClick={() => setIsAddingNew(!isAddingNew)}
                        className="flex items-center gap-2 text-blue-600 font-bold text-sm hover:text-blue-700 transition-colors"
                    >
                        {isAddingNew ? "Cancel" : <><Plus size={18} strokeWidth={3} /> Add New Address</>}
                    </button>
                )}
            </div>

            <div className={`relative transition-all duration-500 ${isConfirmed ? 'scale-100' : 'scale-100'}`}>
                {isConfirmed ? (
                    <div className="bg-white rounded-3xl p-8 border-[3px] border-blue-500 shadow-2xl shadow-blue-100/50 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
                        <div className="flex items-start gap-6 relative z-10 w-full">
                            <div className="bg-blue-500 text-white p-4 rounded-2xl shadow-lg shadow-blue-200">
                                <CheckCircle2 size={32} />
                            </div>
                            <div className="flex-1">
                                <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded tracking-widest mb-2 inline-block">Direct Delivery to</span>
                                <h4 className="font-extrabold text-gray-900 text-2xl leading-tight mb-2">{confirmedAddress?.name}</h4>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-lg">
                                    {confirmedAddress?.address}
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={() => onConfirm(false)}
                            className="w-full md:w-auto bg-gray-50 hover:bg-gray-100 text-[13px] font-black text-gray-400 hover:text-blue-600 px-8 py-4 rounded-2xl transition-all uppercase tracking-widest relative z-10 border border-gray-100 active:scale-95"
                        >
                            Change Location
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        
                        {/* LEFT: Saved Addresses (Only if exist) */}
                        {savedAddresses.length > 0 && (
                            <div className={`${isAddingNew ? 'lg:w-2/5' : 'lg:w-full max-w-4xl mx-auto'} space-y-6`}>
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                                        Pick a Saved Spot
                                    </h3>
                                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                        {savedAddresses.map((addr) => (
                                            <div 
                                                key={addr.id}
                                                onClick={() => handleSelect(addr)}
                                                className={`group cursor-pointer bg-white rounded-2xl p-5 border-2 transition-all duration-300 relative ${selectedId === addr.id ? 'border-blue-500 shadow-xl shadow-blue-50 ring-1 ring-blue-500/20' : 'border-gray-50 hover:border-blue-200'}`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`p-2 rounded-lg transition-all duration-300 ${selectedId === addr.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500'}`}>
                                                        {getTypeIcon(addr.address_type)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-2 mb-1">
                                                            <h4 className="font-bold text-sm text-gray-900 truncate">{addr.full_name}</h4>
                                                            <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded tracking-tighter ${selectedId === addr.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}>{addr.address_type}</span>
                                                        </div>
                                                        <p className="text-[11px] text-gray-500 leading-tight font-medium">
                                                            {addr.house_no || addr.area ? (
                                                                <>{addr.house_no && `${addr.house_no}, `}{addr.area}</>
                                                            ) : (
                                                                <span className="italic opacity-70">{addr.address || 'No details provided'}</span>
                                                            )}
                                                        </p>
                                                        <p className="text-[9px] text-gray-400 font-bold mt-1">
                                                            {addr.city}{addr.postal_code && ` (${addr.postal_code})`}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2">
                                                        <div className="shrink-0 mt-1">
                                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${selectedId === addr.id ? 'border-blue-600' : 'border-gray-300'}`}>
                                                                {selectedId === addr.id && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" style={{ visibility: 'visible' }}></div>}
                                                            </div>
                                                        </div>
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEdit(addr);
                                                            }}
                                                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                            title="Edit Address"
                                                        >
                                                            <Pencil size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <button 
                                        onClick={() => {
                                            const addr = savedAddresses.find(a => a.id === selectedId);
                                            if (addr) {
                                                setConfirmedAddress({
                                                    name: addr.full_name,
                                                    address: `${addr.house_no}, ${addr.area}, ${addr.city} (${addr.postal_code}), Landmark: ${addr.landmark || 'N/A'}`,
                                                    pin: addr.postal_code
                                                });
                                                onConfirm(true);
                                            }
                                        }}
                                        disabled={!selectedId}
                                        className="w-full bg-gray-900 disabled:bg-gray-200 text-white py-5 rounded-2xl font-black hover:bg-black transition-all shadow-xl text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 active:scale-[0.98]"
                                    >
                                        Deliver to Selected <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* DIVIDER (Desktop Only) */}
                        {savedAddresses.length > 0 && <div className="hidden lg:block w-[1px] self-stretch bg-gray-100 my-4"></div>}

                        {/* RIGHT: Address Form - Toggleable */}
                        {isAddingNew ? (
                            <div className="flex-1 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <div className={`w-1 h-4 rounded-full ${editingId ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                                        {editingId ? "Update your details" : (savedAddresses.length > 0 ? "Add a new spot" : "Where should we deliver?")}
                                    </h3>
                                    {(editingId || (savedAddresses.length > 0)) && (
                                        <button 
                                            onClick={() => {
                                                setEditingId(null);
                                                setIsAddingNew(false);
                                                setForm({
                                                    full_name: '', address_type: 'Home', phone: '', house_no: '', area: '', landmark: '', city: '', state: '', postal_code: ''
                                                });
                                            }}
                                            className="text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full hover:bg-red-100 transition-all"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                                
                                <div className="bg-gray-50 rounded-[2rem] p-6 md:p-8 border border-gray-100 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                        <input 
                                            name="full_name" 
                                            value={form.full_name} 
                                            onChange={(e) => { handleInputChange(e); setSelectedId(null); }} 
                                            type="text" 
                                            className="w-full bg-white rounded-xl border-2 border-transparent px-5 py-3.5 outline-none focus:border-blue-500 transition-all font-bold text-gray-800 placeholder:text-gray-300 text-sm" 
                                            placeholder="e.g. John Doe" 
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                        <input 
                                            name="phone" 
                                            value={form.phone} 
                                            onChange={(e) => { handleInputChange(e); setSelectedId(null); }} 
                                            type="text" 
                                            className="w-full bg-white rounded-xl border-2 border-transparent px-5 py-3.5 outline-none focus:border-blue-500 transition-all font-bold text-gray-800 placeholder:text-gray-300 text-sm" 
                                            placeholder="+91 XXXXX XXXXX" 
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    {['Home', 'Work', 'Other'].map(type => (
                                        <button 
                                            key={type}
                                            type="button"
                                            onClick={() => { setForm({...form, address_type: type}); setSelectedId(null); }}
                                            className={`flex-1 py-3 rounded-xl font-black text-[9px] transition-all border-2 uppercase tracking-widest flex items-center justify-center gap-1.5 ${form.address_type === type ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-white text-gray-400 hover:border-blue-100'}`}
                                        >
                                            {getTypeIcon(type)} {type}
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <input 
                                            name="house_no" 
                                            value={form.house_no} 
                                            onChange={(e) => { handleInputChange(e); setSelectedId(null); }} 
                                            type="text" 
                                            className="w-full bg-white rounded-xl border-2 border-transparent px-5 py-3.5 outline-none focus:border-blue-500 transition-all font-bold text-gray-800 placeholder:text-gray-300 text-sm" 
                                            placeholder="House No." 
                                        />
                                        <input 
                                            name="area" 
                                            value={form.area} 
                                            onChange={(e) => { handleInputChange(e); setSelectedId(null); }} 
                                            type="text" 
                                            className="w-full md:col-span-2 bg-white rounded-xl border-2 border-transparent px-5 py-3.5 outline-none focus:border-blue-500 transition-all font-bold text-gray-800 placeholder:text-gray-300 text-sm" 
                                            placeholder="Area / Street" 
                                        />
                                    </div>
                                    <input 
                                        name="landmark" 
                                        value={form.landmark} 
                                        onChange={(e) => { handleInputChange(e); setSelectedId(null); }} 
                                        type="text" 
                                        className="w-full bg-white rounded-xl border-2 border-transparent px-5 py-3.5 outline-none focus:border-blue-500 transition-all font-bold text-gray-800 placeholder:text-gray-300 text-sm" 
                                        placeholder="Landmark (Optional)" 
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <input 
                                            name="city" 
                                            value={form.city} 
                                            onChange={(e) => { handleInputChange(e); setSelectedId(null); }} 
                                            type="text" 
                                            className="w-full bg-white rounded-xl border-2 border-transparent px-5 py-3.5 outline-none focus:border-blue-500 transition-all font-bold text-gray-800 placeholder:text-gray-300 text-sm" 
                                            placeholder="City" 
                                        />
                                        <input 
                                            name="state" 
                                            value={form.state} 
                                            onChange={(e) => { handleInputChange(e); setSelectedId(null); }} 
                                            type="text" 
                                            className="w-full bg-white rounded-xl border-2 border-transparent px-5 py-3.5 outline-none focus:border-blue-500 transition-all font-bold text-gray-800 placeholder:text-gray-300 text-sm" 
                                            placeholder="State" 
                                        />
                                        <input 
                                            name="postal_code" 
                                            value={form.postal_code} 
                                            onChange={(e) => { handleInputChange(e); setSelectedId(null); }} 
                                            type="text" 
                                            className="w-full bg-white rounded-xl border-2 border-transparent px-5 py-3.5 outline-none focus:border-blue-500 transition-all font-bold text-gray-800 placeholder:text-gray-300 text-sm" 
                                            placeholder="XXXXXX" 
                                        />
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={handleSaveNewAddress}
                                    disabled={!form.full_name || !form.phone || !form.house_no || !form.area || !form.city || !form.postal_code}
                                    className="w-full bg-blue-600 disabled:bg-gray-200 text-white py-5 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 text-xs flex items-center justify-center gap-2 uppercase tracking-[0.2em] active:scale-[0.98]"
                                >
                                    {editingId ? (
                                        <><CheckCircle2 size={18} strokeWidth={3} /> Update Address Details</>
                                    ) : (
                                        <><Plus size={18} strokeWidth={3} /> Save and Use New</>
                                    )}
                                </button>
                            </div>
                        </div>
                        ) : (
                            /* Empty state or Just List */
                            savedAddresses.length === 0 && (
                                <div className="flex-1 flex flex-col items-center justify-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-100 space-y-6">
                                    <div className="bg-blue-50 p-6 rounded-full">
                                        <MapPin size={48} className="text-blue-300" />
                                    </div>
                                    <div className="text-center space-y-2">
                                        <h3 className="text-xl font-bold text-gray-800">No Saved Addresses Found</h3>
                                        <p className="text-sm text-gray-400 font-medium">Add an address to continue with your checkout</p>
                                    </div>
                                    <button 
                                        onClick={() => setIsAddingNew(true)}
                                        className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2"
                                    >
                                        <Plus size={18} strokeWidth={3} /> Add New Address
                                    </button>
                                </div>
                            )
                        )}
                    </div>

                )}
            </div>
        </div>
    );
}
