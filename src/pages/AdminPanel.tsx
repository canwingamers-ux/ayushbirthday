import { useEffect, useState, ChangeEvent } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, storage, auth } from '../firebase';
import { Friend } from '../types';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Plus, Edit, Trash, Upload, X, ArrowLeft, LogOut, MonitorPlay } from 'lucide-react';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword, onAuthStateChanged, User, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import FriendExperience from './FriendExperience';

export default function AdminPanel() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [editingFriend, setEditingFriend] = useState<Friend | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(collection(db, 'friends'), (snapshot) => {
      setFriends(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Friend)));
    });
    return unsubscribe;
  }, [user]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    }
  };

  if (authLoading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-white font-sans relative">
        <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} /> <span className="text-sm font-medium">Back to Home</span>
        </Link>
        <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold mb-2 tracking-tight text-center">{isRegistering ? 'Register' : 'Admin Login'}</h1>
          <p className="text-gray-500 text-center mb-8 text-sm">Protected area. Please authenticate.</p>
          
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                required
              />
            </div>
            {authError && <p className="text-red-500 text-sm">{authError}</p>}
            <button type="submit" className="w-full bg-white text-black font-semibold rounded-xl py-3 mt-4 hover:bg-gray-200 transition-colors">
              {isRegistering ? 'Create Account' : 'Login'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-gray-500 hover:text-white text-sm transition-colors"
            >
              {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleAddNew = () => {
    setIsNew(true);
    const newFriend: Friend = {
      id: '',
      name: '',
      pin: '',
      profilePhoto: '',
      customMessage: '',
      photoTemplate: [],
      collagePhotos: [],
      collageParagraph: '',
      showParagraph: false,
      theme: 'midnight',
      birthdate: '',
      visits: 0,
      candleBlown: 0
    };
    setEditingFriend(newFriend);
  };

  const handleSave = async (friend: Friend) => {
    try {
      if (!friend.name || !friend.pin || !friend.id) {
        alert("ID (Link), Name, and PIN are required!");
        return;
      }
      // sanitize ID
      const sanitizedId = friend.id.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
      await setDoc(doc(db, 'friends', sanitizedId), { ...friend, id: sanitizedId });
      setEditingFriend(null);
      setIsNew(false);
    } catch (e) {
      console.error(e);
      alert("Failed to save. Ensure Firebase rules allow writing.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this friend?")) {
      await deleteDoc(doc(db, 'friends', id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-400 hover:text-white transition-colors bg-gray-900 p-2 rounded-full border border-gray-800">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-3">
            {!editingFriend && (
              <button 
                onClick={handleAddNew}
                className="bg-white text-black px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-200 transition-colors"
              >
                <Plus size={18} /> Add Friend
              </button>
            )}
            <button 
              onClick={() => signOut(auth)}
              className="bg-red-500/10 text-red-500 px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-red-500/20 transition-colors border border-red-500/20"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {editingFriend ? (
          <FriendEditor 
            friend={editingFriend} 
            isNew={isNew}
            onSave={handleSave} 
            onCancel={() => { setEditingFriend(null); setIsNew(false); }} 
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="col-span-full mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col justify-center text-center shadow-lg">
                <span className="text-gray-400 text-sm mb-1 uppercase tracking-widest font-medium">Total Friends</span>
                <span className="text-3xl font-bold text-white">{friends.length}</span>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col justify-center text-center shadow-lg">
                <span className="text-gray-400 text-sm mb-1 uppercase tracking-widest font-medium">Total Visits</span>
                <span className="text-3xl font-bold text-blue-400">
                  {friends.reduce((acc, f) => acc + (f.visits || 0), 0)}
                </span>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col justify-center text-center shadow-lg">
                <span className="text-gray-400 text-sm mb-1 uppercase tracking-widest font-medium">Candles Blown</span>
                <span className="text-3xl font-bold text-orange-400">
                  {friends.reduce((acc, f) => acc + (f.candleBlown || 0), 0)}
                </span>
              </div>
            </div>

            {friends.map(friend => (
              <div key={friend.id} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="flex items-center gap-4 mb-4">
                  {friend.profilePhoto ? (
                    <img src={friend.profilePhoto} alt="" className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center font-bold">
                      {friend.name.charAt(0) || '?'}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">{friend.name || 'Unnamed'}</h3>
                    <p className="text-gray-400 text-sm">PIN: {friend.pin}</p>
                  </div>
                </div>
                
                <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-gray-950 p-2 rounded border border-gray-800 text-center">
                    <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Visits</div>
                    <div className="font-mono text-lg text-white">{friend.visits || 0}</div>
                  </div>
                  <div className="bg-gray-950 p-2 rounded border border-gray-800 text-center">
                    <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Candles</div>
                    <div className="font-mono text-lg text-white">{friend.candleBlown || 0}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setEditingFriend(friend)} className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded-md flex items-center justify-center gap-2 transition-colors">
                    <Edit size={16} /> Edit
                  </button>
                  <button onClick={() => handleDelete(friend.id)} className="bg-red-950 text-red-400 hover:bg-red-900 px-3 rounded-md transition-colors">
                    <Trash size={16} />
                  </button>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-800 text-xs text-gray-500 break-all">
                  Link: {window.location.origin}/{friend.id}
                </div>
              </div>
            ))}
            {friends.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                No friends added yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function FriendEditor({ friend, isNew, onSave, onCancel }: { friend: Friend, isNew: boolean, onSave: (f: Friend) => void, onCancel: () => void }) {
  const [data, setData] = useState(friend);
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          const max = 600;
          if (width > height && width > max) { height *= max / width; width = max; }
          else if (height > max) { width *= max / height; height = max; }
          canvas.width = width; canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.6));
        };
      };
      reader.onerror = reject;
    });
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>, field: 'profilePhoto' | 'photoTemplate' | 'collagePhotos' | 'pinPhoto' | 'introPhoto' | 'outroPhoto' | 'letterPhotos' | 'introLinePhoto', multiple = false) => {
    if (!e.target.files?.length) return;
    setUploading(true);
    
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        try {
          // Attempt standard Firebase Storage
          const fileRef = ref(storage, `photos/${data.id || 'new'}/${Date.now()}_${file.name}`);
          const snapshot = await uploadBytes(fileRef, file);
          const url = await getDownloadURL(snapshot.ref);
          newUrls.push(url);
        } catch (storageErr) {
          console.warn("Storage upload failed, falling back to Base64 compression.", storageErr);
          // Fallback to local Base64 string if Firebase rules are strict
          const base64Str = await compressImage(file);
          newUrls.push(base64Str);
        }
      }
      
      if (['profilePhoto', 'pinPhoto', 'introPhoto', 'outroPhoto', 'introLinePhoto'].includes(field)) {
        setData({ ...data, [field]: newUrls[0] });
      } else {
        setData({ ...data, [field]: [...((data[field] as string[]) || []), ...newUrls] });
      }
    } catch (e) {
      console.error(e);
      alert("Failed to process image.");
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (field: 'photoTemplate' | 'collagePhotos' | 'letterPhotos', index: number) => {
    const newArr = [...(data[field] || [])];
    newArr.splice(index, 1);
    setData({ ...data, [field]: newArr });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start h-auto lg:h-[calc(100vh-140px)] w-full">
      <div className="flex-1 w-full lg:overflow-y-auto pr-2 pb-12 bg-gray-900 p-6 rounded-xl border border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Editing Profile</h2>
          <div className="flex items-center gap-4">
            <button onClick={onCancel} className="text-gray-400 hover:text-white"><X size={20} /></button>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl mb-6 text-sm text-blue-200">
          <p><strong>Note on Images:</strong> If uploading fails due to storage permissions, the app will automatically try to compress and store the image as text. For best results, keep images under 1MB or paste a direct image URL.</p>
        </div>

        <div className="space-y-6">
        {isNew && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Custom Link (e.g. 'ayush', 'jane-bday')</label>
            <input 
              type="text" 
              value={data.id} 
              onChange={e => setData({...data, id: e.target.value.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase()})}
              placeholder="my-friend-name"
              className="w-full bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-white focus:outline-none focus:border-white font-mono"
            />
            <p className="text-xs text-gray-500 mt-1">This will be their URL: {window.location.origin}/{data.id || 'my-friend-name'}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
            <input 
              type="text" 
              value={data.name} 
              onChange={e => setData({...data, name: e.target.value})}
              className="w-full bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-white focus:outline-none focus:border-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">6-Digit PIN</label>
            <input 
              type="text" 
              value={data.pin} 
              onChange={e => setData({...data, pin: e.target.value})}
              maxLength={6}
              className="w-full bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-white focus:outline-none focus:border-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Theme</label>
            <select 
              value={data.theme || 'midnight'} 
              onChange={e => setData({...data, theme: e.target.value})}
              className="w-full bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-white focus:outline-none focus:border-white"
            >
              <option value="midnight">Midnight (Dark)</option>
              <option value="ocean">Ocean (Blue)</option>
              <option value="sunset">Sunset (Orange)</option>
              <option value="forest">Forest (Green)</option>
              <option value="rose">Rose (Pink)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Hero Font</label>
            <select 
              value={data.heroFont || 'Inter, system-ui, sans-serif'} 
              onChange={e => setData({...data, heroFont: e.target.value})}
              className="w-full bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-white focus:outline-none focus:border-white"
            >
              <option value="Inter, system-ui, sans-serif">Inter (Modern)</option>
              <option value="'Playfair Display', serif">Playfair Display (Elegant)</option>
              <option value="'Dancing Script', cursive">Dancing Script (Cursive)</option>
              <option value="'Pacifico', cursive">Pacifico (Playful)</option>
              <option value="'Space Grotesk', sans-serif">Space Grotesk (Tech)</option>
              <option value="'Cinzel', serif">Cinzel (Cinematic)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Birthdate</label>
            <input 
              type="date" 
              value={data.birthdate || ''} 
              onChange={e => setData({...data, birthdate: e.target.value})}
              className="w-full bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-white focus:outline-none focus:border-white [color-scheme:dark]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Intro Line (Scene 2)</label>
          <input 
            type="text" 
            value={data.introLine || ''} 
            onChange={e => setData({...data, introLine: e.target.value})}
            placeholder="May your life be filled with joy..."
            className="w-full bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-white focus:outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Background Music URL (Optional)</label>
          <input 
            type="url" 
            value={data.bgmUrl || ''} 
            onChange={e => setData({...data, bgmUrl: e.target.value})}
            placeholder="https://example.com/song.mp3"
            className="w-full bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-white focus:outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Profile Photo</label>
          <div className="flex items-center gap-4 mb-2">
            {data.profilePhoto && <img src={data.profilePhoto} className="w-16 h-16 rounded-full object-cover" />}
            <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md text-sm transition-colors flex items-center gap-2">
              <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload'}
              <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'profilePhoto')} disabled={uploading} />
            </label>
            {data.profilePhoto && <button onClick={() => setData({...data, profilePhoto: ''})} className="text-red-400 text-sm">Remove</button>}
          </div>
          <input 
            type="text" 
            placeholder="Or paste an image URL directly..."
            value={data.profilePhoto}
            onChange={e => setData({...data, profilePhoto: e.target.value})}
            className="w-full bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">PIN Screen Photo</label>
          <div className="flex items-center gap-4 mb-2">
            {data.pinPhoto && <img src={data.pinPhoto} className="w-16 h-16 rounded-full object-cover" />}
            <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md text-sm transition-colors flex items-center gap-2">
              <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload'}
              <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'pinPhoto')} disabled={uploading} />
            </label>
            {data.pinPhoto && <button onClick={() => setData({...data, pinPhoto: ''})} className="text-red-400 text-sm">Remove</button>}
          </div>
          <input 
            type="text" 
            placeholder="Or paste an image URL directly..."
            value={data.pinPhoto || ''}
            onChange={e => setData({...data, pinPhoto: e.target.value})}
            className="w-full bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Intro Scene Photo (Scene 1 Background)</label>
          <div className="flex items-center gap-4 mb-2">
            {data.introPhoto && <img src={data.introPhoto} className="w-16 h-16 rounded-lg object-cover" />}
            <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md text-sm transition-colors flex items-center gap-2">
              <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload'}
              <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'introPhoto')} disabled={uploading} />
            </label>
            {data.introPhoto && <button onClick={() => setData({...data, introPhoto: ''})} className="text-red-400 text-sm">Remove</button>}
          </div>
          <input 
            type="text" 
            placeholder="Or paste an image URL directly..."
            value={data.introPhoto || ''}
            onChange={e => setData({...data, introPhoto: e.target.value})}
            className="w-full bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Custom Message</label>
          <textarea 
            value={data.customMessage} 
            onChange={e => setData({...data, customMessage: e.target.value})}
            className="w-full bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-white h-24 focus:outline-none focus:border-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Intro Line Background Photo</label>
            <div className="flex items-center gap-4 mb-2">
              {data.introLinePhoto && <img src={data.introLinePhoto} className="w-16 h-16 rounded-lg object-cover" />}
              <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md text-sm transition-colors flex items-center gap-2">
                <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload'}
                <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'introLinePhoto')} disabled={uploading} />
              </label>
              {data.introLinePhoto && <button onClick={() => setData({...data, introLinePhoto: ''})} className="text-red-400 text-sm">Remove</button>}
            </div>
            <input 
              type="text" 
              placeholder="Or paste an image URL directly..."
              value={data.introLinePhoto || ''}
              onChange={e => setData({...data, introLinePhoto: e.target.value})}
              className="w-full bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Photo Template Photos (Scene 3)</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {data.photoTemplate.map((url, i) => (
              <div key={i} className="relative group">
                <img src={url} className="w-20 h-20 object-cover rounded-md" />
                <button onClick={() => removePhoto('photoTemplate', i)} className="absolute top-1 right-1 bg-black/50 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md text-sm inline-flex items-center gap-2 transition-colors">
              <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload Photos'}
              <input type="file" accept="image/*" multiple className="hidden" onChange={e => handleImageUpload(e, 'photoTemplate', true)} disabled={uploading} />
            </label>
            <input 
              type="text" 
              placeholder="Or paste an image URL & press Enter..."
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const target = e.target as HTMLInputElement;
                  if (target.value) {
                    setData({...data, photoTemplate: [...data.photoTemplate, target.value]});
                    target.value = '';
                  }
                }
              }}
              className="flex-1 bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Collage Photos (Scene 5)</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {data.collagePhotos.map((url, i) => (
              <div key={i} className="relative group">
                <img src={url} className="w-20 h-20 object-cover rounded-md" />
                <button onClick={() => removePhoto('collagePhotos', i)} className="absolute top-1 right-1 bg-black/50 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md text-sm inline-flex items-center gap-2 transition-colors">
              <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload Photos'}
              <input type="file" accept="image/*" multiple className="hidden" onChange={e => handleImageUpload(e, 'collagePhotos', true)} disabled={uploading} />
            </label>
            <input 
              type="text" 
              placeholder="Or paste an image URL & press Enter..."
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const target = e.target as HTMLInputElement;
                  if (target.value) {
                    setData({...data, collagePhotos: [...data.collagePhotos, target.value]});
                    target.value = '';
                  }
                }
              }}
              className="flex-1 bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white"
            />
          </div>
        </div>
        
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={data.showParagraph} 
              onChange={e => setData({...data, showParagraph: e.target.checked})}
              className="rounded bg-gray-950 border-gray-800 text-white"
            />
            Show Collage Paragraph
          </label>
          {data.showParagraph && (
            <textarea 
              value={data.collageParagraph} 
              onChange={e => setData({...data, collageParagraph: e.target.value})}
              placeholder="Paragraph to show with collage..."
              className="w-full bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-white h-24 focus:outline-none focus:border-white"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Letter Text (Scene 4)</label>
          <textarea 
            value={data.letterText || ''} 
            onChange={e => setData({...data, letterText: e.target.value})}
            placeholder="Write a long personalized letter... (Markdown supported)"
            className="w-full bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-white h-32 focus:outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Letter Photos (Scene 4)</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {(data.letterPhotos || []).map((url, i) => (
              <div key={i} className="relative group">
                <img src={url} className="w-20 h-20 object-cover rounded-md" />
                <button onClick={() => removePhoto('letterPhotos', i)} className="absolute top-1 right-1 bg-black/50 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md text-sm inline-flex items-center gap-2 transition-colors">
              <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload Photos'}
              <input type="file" accept="image/*" multiple className="hidden" onChange={e => handleImageUpload(e, 'letterPhotos', true)} disabled={uploading} />
            </label>
            <input 
              type="text" 
              placeholder="Or paste an image URL & press Enter..."
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const target = e.target as HTMLInputElement;
                  if (target.value) {
                    setData({...data, letterPhotos: [...(data.letterPhotos || []), target.value]});
                    target.value = '';
                  }
                }
              }}
              className="flex-1 bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Outro Scene Photo (Scene 8 Background)</label>
          <div className="flex items-center gap-4 mb-2">
            {data.outroPhoto && <img src={data.outroPhoto} className="w-16 h-16 rounded-lg object-cover" />}
            <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md text-sm transition-colors flex items-center gap-2">
              <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload'}
              <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'outroPhoto')} disabled={uploading} />
            </label>
            {data.outroPhoto && <button onClick={() => setData({...data, outroPhoto: ''})} className="text-red-400 text-sm">Remove</button>}
          </div>
          <input 
            type="text" 
            placeholder="Or paste an image URL directly..."
            value={data.outroPhoto || ''}
            onChange={e => setData({...data, outroPhoto: e.target.value})}
            className="w-full bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white"
          />
        </div>
        </div> {/* CLOSE space-y-6 */}
        
        <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3 sticky bottom-0 bg-gray-900 pt-4 pb-2 border-t border-gray-800 z-10">
          <button onClick={onCancel} className="px-4 py-2 text-gray-400 hover:text-white transition-colors bg-gray-800 rounded-md">Cancel</button>
          <button onClick={() => onSave(data)} className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors">
            Save Friend
          </button>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="flex-1 w-full lg:h-full block">
        <div className="lg:hidden flex justify-between items-center mb-4 mt-8">
          <h2 className="text-xl font-bold">Live Preview</h2>
        </div>
        <div className="w-full h-full border border-gray-800 rounded-3xl overflow-hidden bg-black relative shadow-2xl min-h-[600px]">
          <FriendExperience previewFriend={data} />
          <div className="absolute top-4 right-4 z-[100] bg-black/50 backdrop-blur px-3 py-1 rounded-full text-xs text-white/70 pointer-events-none">
            Interactive Preview
          </div>
        </div>
      </div>
    </div>
  );
}
