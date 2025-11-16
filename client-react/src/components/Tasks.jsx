import React, { useState, useEffect, useMemo, useRef } from 'react';
import fileIconMap from '../utils/fileIconMap';
import AdminDangerZone from './Common/AdminDangerZone';
import { FaUserCircle, FaFilter, FaSort, FaCheckCircle, FaHourglassHalf } from 'react-icons/fa';
import { useApp } from '../context/AppContext';
import styled from 'styled-components';

// Импорт иконок файлов
import excelIcon from '../assets/icons/excel.png';
import pdfIcon from '../assets/icons/pdf.png';
import wordIcon from '../assets/icons/word.png';
import rarIcon from '../assets/icons/rar.png';
import photoIcon from '../assets/icons/photo.png';

// Styled components объявлены вне функции
const Wrapper = styled.div`
  width: 100%;
  min-height: 100%;
  background: transparent;
  border-radius: 0;
  box-shadow: none;
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  position: relative;
  overflow: hidden;
  flex: 1;
  color: #fff;
`;

const Title = styled.h2`
  color: #6dd5ed;
  font-size: 1.4rem;
  font-weight: 800;
  margin-bottom: 24px;
  letter-spacing: 0.01em;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TopBar = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 24px;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  box-shadow: none;
`;

const TopBtn = styled.button`
  padding: 6px 12px;
  border: 2px solid #6dd5ed;
  border-radius: 6px;
  background: rgba(109, 213, 237, 0.2);
  color: #6dd5ed;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    border-color: #6dd5ed;
    color: #6dd5ed;
    background: rgba(109, 213, 237, 0.3);
  }
`;

const TopBtnOutline = styled.button`
  padding: 6px 12px;
  border: 2px solid #2c3e50;
  border-radius: 6px;
  background: transparent;
  color: #b2bec3;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    border-color: #6dd5ed;
    color: #6dd5ed;
  }
`;

const DangerBtn = styled(TopBtn)`
  border-color: #e74c3c;
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
  
  &:hover {
    border-color: #e74c3c;
    color: #e74c3c;
    background: rgba(231, 76, 60, 0.3);
  }
`;

const Form = styled.form`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  justify-content: flex-start;
  background: rgba(44, 62, 80, 0.2);
  border-radius: 12px;
  box-shadow: none;
  padding: 16px;
  border: none;
  width: 100%;
  box-sizing: border-box;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #2c3e50;
  border-radius: 12px;
  background: rgba(44, 62, 80, 0.3);
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;
  
  &:focus {
    border-color: #6dd5ed;
    background: rgba(44, 62, 80, 0.5);
  }
  
  &::placeholder {
    color: #b2bec3;
  }
`;

const Button = styled.button`
  padding: 12px 16px;
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  
  &:hover {
    background: linear-gradient(135deg, #38f9d7 0%, #43e97b 100%);
    transform: translateY(-2px);
  }
`;

const CardList = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Card = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(44, 62, 80, 0.3);
  border-radius: 8px;
  border-left: 3px solid ${props => 
    props.priority === 'high' ? '#e74c3c' :
    props.priority === 'medium' ? '#f39c12' : '#27ae60'
  };
  transition: all 0.2s;
  min-height: 80px;
  
  &:hover {
    background: rgba(44, 62, 80, 0.5);
    transform: translateX(2px);
  }
`;

const CardInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
`;

const CardTitle = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.2;
  color: #fff;
`;

const CardDesc = styled.span`
  font-size: 0.8rem;
  color: #b2bec3;
  line-height: 1.2;
  margin-left: 8px;
`;

const DeleteBtn = styled.button`
  padding: 8px;
  background: transparent;
  border: none;
  color: #b2bec3;
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #e74c3c;
  }
`;

const PrioritySelect = styled.select`
  padding: 12px 16px;
  border: 2px solid #2c3e50;
  border-radius: 12px;
  background: rgba(44, 62, 80, 0.3);
  color: #fff;
  font-size: 1rem;
  outline: none;
  cursor: pointer;
  
  &:focus {
    border-color: #6dd5ed;
  }
  
  option {
    background: #232931;
    color: #fff;
  }
`;

const PriorityBadge = styled.span`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${props => 
    props.priority === 'high' ? '#e74c3c' :
    props.priority === 'medium' ? '#f39c12' : '#27ae60'
  };
  color: #fff;
`;

const StatsSection = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background: rgba(44, 62, 80, 0.2);
  border-radius: 12px;
`;

const StatItem = styled.div`
  text-align: center;
  flex: 1;
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.color || '#6dd5ed'};
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #b2bec3;
  margin-top: 4px;
`;

// Компонент ModalBg должен быть объявлен вне основного компонента Tasks
function ModalBg({ children, onClose }) {
  return (
    <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,zIndex:9999,background:'rgba(34,40,49,0.82)',width:'100%',height:'100%',display:'flex',alignItems:'stretch',justifyContent:'center'}} onClick={onClose}>
      <div style={{width:'100%',height:'100%',background:'none',padding:0,margin:0,boxSizing:'border-box',position:'relative',overflow:'auto'}} onClick={e=>e.stopPropagation()}>
        <button onClick={onClose} style={{position:'absolute',top:18,right:24,fontSize:28,background:'none',border:'none',cursor:'pointer',color:'#43e97b',zIndex:2}}>×</button>
        {children}
      </div>
    </div>
  );
}

// Функция для получения иконки файла по расширению
function getFileIcon(filename) {
  if (!filename) return photoIcon;
  
  const ext = filename.split('.').pop()?.toLowerCase();
  
  switch (ext) {
    case 'xlsx':
    case 'xls':
    case 'csv':
      return excelIcon;
    case 'pdf':
      return pdfIcon;
    case 'docx':
    case 'doc':
      return wordIcon;
    case 'zip':
    case 'rar':
    case '7z':
      return rarIcon;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
    case 'webp':
    case 'svg':
      return photoIcon;
    default:
      return photoIcon;
  }
}

// Основной компонент Tasks
function Tasks({ isMobile = false }) {
  const { state } = useApp();
  const [viewTaskId, setViewTaskId] = useState(null);
  const [swipeData, setSwipeData] = useState({});
  const [deadlineTimer, setDeadlineTimer] = useState('');
  const [isLandscape, setIsLandscape] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth > window.innerHeight;
    }
    return false;
  });
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', assignedTo: '', deadline: '', priority: 'medium' });
  const [files, setFiles] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showComplete, setShowComplete] = useState(null);
  const [showExtend, setShowExtend] = useState(null);
  const [comment, setComment] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [commentError, setCommentError] = useState('');
  const [isCompletionRequired, setIsCompletionRequired] = useState(false);
  const [filter, setFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [showComment, setShowComment] = useState(null);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [tempDescription, setTempDescription] = useState('');
  const [showDescEmoji, setShowDescEmoji] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchUserId, setSearchUserId] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  // Поисковая модалка: combobox для пользователей
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchHighlight, setSearchHighlight] = useState(0);
  const [searchRole, setSearchRole] = useState('assignee'); // 'assignee' | 'author'
  const filteredSearchUsers = useMemo(() => {
    const simplify = (s) => String(s ?? '')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase().trim();
    const q = simplify(searchQuery);
    const qTokens = q.split(/\s+/).filter(Boolean);
    const list = Array.isArray(users) ? users : [];
    if (!qTokens.length) return [];
    return list.filter(u => {
      const first = simplify(u.firstName || u.firstname || u.name || u.first || u.givenName || u.given_name);
      const last = simplify(u.lastName || u.lastname || u.surname || u.last || u.familyName || u.family_name);
      const middle = simplify(u.patronymic || u.middleName || u.middlename || u.middle_name);
      const disp = simplify(u.displayName || u.display || `${first} ${last}`);
      const login = simplify(u.login || u.username);
      const tokens = [first, last, middle, disp, login].filter(Boolean).flatMap(s => s.split(/\s+/));
      // Все токены запроса должны совпасть по началу с любым из токенов пользователя
      return qTokens.every(qt => tokens.some(t => t.startsWith(qt)));
    });
  }, [users, searchQuery]);

  // Фильтрация задач по выбранным параметрам + живые результаты при вводе (строго по префиксу; роль: исполнитель/автор управляется переключателем)
  useEffect(() => {
    const uid = String(searchUserId || '').trim();
    const date = String(searchDate || '').trim();
    const sameDay = (isoA, isoB) => {
      if (!isoA || !isoB) return false;
      const a = new Date(isoA); const b = new Date(isoB);
      return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
    };
    // Если пользователь не выбран явно, но есть ввод, используем совпавших по запросу пользователей (префиксы)
    const matchedIds = (Array.isArray(filteredSearchUsers) ? filteredSearchUsers : []).map(u => String(u.id));
    // Если есть ввод, но совпадений по пользователям нет — возвращаем пустой результат
    if (!uid && searchQuery.trim() && matchedIds.length === 0) {
      setSearchResults([]);
      return;
    }
    const list = Array.isArray(tasks) ? tasks : [];
    const filtered = list.filter(t => {
      const assigneeId = String(t.assignedTo);
      const authorId = String(t.authorId);
      const userMatch = uid
        ? (searchRole === 'assignee' ? assigneeId === uid : authorId === uid)
        : (searchQuery ? (searchRole === 'assignee' ? matchedIds.includes(assigneeId) : matchedIds.includes(authorId)) : true);
      const dateMatch = date ? (t.createdAt && sameDay(t.createdAt, date)) : true;
      return userMatch && dateMatch;
    });
    setSearchResults(filtered);
  }, [tasks, searchUserId, searchDate, searchQuery, filteredSearchUsers, searchRole]);
  // Быстрый поиск исполнителя в модалке создания задачи
  const [assigneeQuery, setAssigneeQuery] = useState('');
  const filteredAssignees = useMemo(() => {
    const simplify = (s) => String(s ?? '')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase().trim();
    const qRaw = String(assigneeQuery || '');
    const q = simplify(qRaw);
    const qTokens = q.split(/\s+/).filter(Boolean);
    const list = Array.isArray(users) ? users : [];
    if (!q) return list;
    return list.filter(u => {
      const username = simplify(u.username);
      const login = simplify(u.login);
      const firstName = simplify(u.firstName || u.firstname || u.name || u.first || u.givenName || u.given_name);
      const lastName = simplify(u.lastName || u.lastname || u.surname || u.last || u.familyName || u.family_name);
      const patronymic = simplify(u.patronymic || u.middleName || u.middlename || u.middle_name);
      const fio = simplify(u.fio || `${lastName} ${firstName} ${patronymic}`);
      const fullName = simplify(u.fullName || u.fullname || u.nameRu || `${firstName} ${lastName}`);
      const displayName = simplify(u.displayName || u.display || fio || fullName || `${firstName} ${lastName}`);
      const email = simplify(u.email);
      const phone = simplify(u.phone || u.tel || '');
      const id = simplify(u.id);
      const haystack = [username, login, firstName, lastName, patronymic, fio, fullName, displayName, email, phone, id]
        .filter(Boolean)
        .join(' ');
      // Фолбэк: по всем строковым значениям объекта пользователя (на случай неожиданных полей)
      const allValues = simplify(Object.values(u).join(' '));

      // Все токены из запроса должны встречаться в любой комбинации слов (поддержка ввода первых букв)
      const allTokensMatch = qTokens.every(tok => haystack.includes(tok));
      // Также поддержим быстрый старт по началу имени/фамилии/логина
      const starts = username.startsWith(q) || login.startsWith(q) || firstName.startsWith(q) || lastName.startsWith(q) || displayName.startsWith(q) || fio.startsWith(q) || fullName.startsWith(q);
      return allTokensMatch || starts || allValues.includes(q);
    });
  }, [users, assigneeQuery]);

  // Combobox UI state for assignee
  const [assigneeOpen, setAssigneeOpen] = useState(false);
  const [assigneeHighlight, setAssigneeHighlight] = useState(0);
  const selectedAssignee = useMemo(() => {
    const list = Array.isArray(users) ? users : [];
    return list.find(u => String(u.id) === String(form.assignedTo));
  }, [users, form.assignedTo]);
  const getAssigneeLabel = (u) => {
    if (!u) return '';
    const firstName = u.firstName || u.firstname || '';
    const lastName = u.lastName || u.lastname || '';
    const display = u.displayName || u.display || [firstName, lastName].filter(Boolean).join(' ').trim();
    const login = u.login || u.username || '';
    return (display || login || u.email || String(u.id)).trim();
  };
  const assigneeSelectedLabel = useMemo(() => getAssigneeLabel(selectedAssignee), [selectedAssignee]);

  // Получение текущего пользователя
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(u);
  }, []);

  // Загрузка пользователей
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/users', {
      headers: token ? { 'Authorization': 'Bearer ' + token } : {}
    })
      .then(r => r.json())
      .then(data => {
        console.log('USERS LOADED:', data);
        const arr = Array.isArray(data) ? data : (Array.isArray(data.users) ? data.users : []);
        setUsers(arr);
      })
      .catch(() => setUsers([]));
  }, []);

  // Загрузка задач
  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem('token');
    let url = '/api/tasks';
    if (filter === 'open') url = '/api/tasks/open';
    else if (filter === 'completed') url = '/api/tasks/completed';
    
    fetch(url.startsWith('/api/') ? `http://localhost:5000${url}` : url, {
      headers: token ? { 'Authorization': 'Bearer ' + token } : {}
    })
      .then(r => r.json())
      .then(data => { 
        setTasks(data); 
        setLoading(false); 
      })
      .catch(err => { 
        console.error('Error loading tasks:', err);
        setTasks([]); 
        setLoading(false); 
      });
  }, [filter]);

  // Отслеживание ориентации экрана для мобильной версии
  useEffect(() => {
    if (!isMobile) return;
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [isMobile]);

  // Корректная фильтрация задач по выбранному фильтру
  const filtered = useMemo(() => {
    if (!Array.isArray(tasks)) return [];
    
    let arr = [];
    if (filter === 'all') arr = tasks;
    else if (filter === 'open') arr = tasks.filter(t => !t.status || t.status === 'open' || (t.status !== 'completed' && t.status !== 'closed'));
    else if (filter === 'completed') arr = tasks.filter(t => t.status === 'completed' || t.status === 'closed');
    else arr = tasks;
    
    // Фильтрация по приоритету
    if (priorityFilter !== 'all') {
      arr = arr.filter(t => t.priority === priorityFilter);
    }
    
    // Сортировка: последние задачи сверху
    return arr.slice().sort((a, b) => {
      const dateA = new Date(a.created_at || a.deadline || 0);
      const dateB = new Date(b.created_at || b.deadline || 0);
      return dateB - dateA;
    });
  }, [tasks, filter, priorityFilter]);

  // Статистика задач
  const stats = useMemo(() => {
    if (!Array.isArray(tasks)) return { total: 0, completed: 0, active: 0, high: 0 };
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'completed' || t.status === 'closed').length,
      active: tasks.filter(t => t.status !== 'completed' && t.status !== 'closed').length,
      high: tasks.filter(t => t.priority === 'high' && t.status !== 'completed' && t.status !== 'closed').length
    };
  }, [tasks]);

  // Таймеры для миниатюр задач
  const [miniTimers, setMiniTimers] = useState({});
  useEffect(() => {
    // Обновлять таймеры каждую секунду
    const updateAllTimers = () => {
      const timers = {};
      filtered.forEach(t => {
        if (!t.deadline) return;
        // Не показывать таймер для "Выполнена" или "Закрыта"
        if (t.status === 'completed' || t.status === 'closed') return;
        const deadline = new Date(t.deadline);
        const now = new Date();
        const diffMs = deadline - now;
        if (diffMs > 0) {
          const hours = Math.floor(diffMs / (1000 * 60 * 60));
          const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
          timers[t.id] = `осталось ${hours}ч ${minutes}м ${seconds}с`;
        } else {
          timers[t.id] = 'просрочено';
        }
      });
      setMiniTimers(timers);
    };
    updateAllTimers();
    const interval = setInterval(updateAllTimers, 1000);
    return () => clearInterval(interval);
  }, [filtered]);

  const handleClearCompleted = () => {
    if (!window.confirm('Удалить все выполненные задачи?')) return;
    setLoading(true);
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/tasks/completed', {
      method: 'DELETE',
      headers: token ? { 'Authorization': 'Bearer ' + token } : {}
    })
      .then(() => {
        setTasks(tsk => tsk.filter(t => t.status !== 'completed' && t.status !== 'closed'));
        setFilter('all');
      });
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.title || !form.description || !form.assignedTo || !form.deadline) return;
    const token = localStorage.getItem('token');
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    if (files && files.length > 0) {
      const names = [];
      for (let i = 0; i < files.length; i++) {
        data.append('files', files[i]);
        names.push(files[i].name);
      }
      data.append('originalName', JSON.stringify(names));
    }
    fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: data
    })
      .then(r => r.json())
      .then(newTask => {
        setForm({ title: '', description: '', assignedTo: '', deadline: '', priority: 'medium' });
        setFiles([]);
        const token = localStorage.getItem('token');
        let url = '/api/tasks';
        fetch(url.startsWith('/api/') ? `http://localhost:5000${url}` : url, {
          headers: token ? { 'Authorization': 'Bearer ' + token } : {}
        })
          .then(r => r.json())
          .then(data => setTasks(data))
          .catch(() => setTasks([]));
      });
  };

  // Для отображения выбранных файлов и удаления
  const handleFileChange = e => {
    setFiles(Array.from(e.target.files));
  };

  const handleRemoveFile = idx => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleDelete = id => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: 'DELETE',
      headers: token ? { 'Authorization': 'Bearer ' + token } : {}
    })
      .then(() => setTasks(tsk => tsk.filter(t => t.id !== id)));
  };


  const handleComplete = id => {
    // Проверяем, что комментарий не пустой
    if (!comment.trim()) {
      setCommentError('Комментарий обязателен для выполнения задачи');
      return;
    }
    
    setCommentError('');
    setIsCompletionRequired(false);
    const token = localStorage.getItem('token');
    fetch(`http://localhost:5000/api/tasks/${id}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ comment })
    })
      .then(r => r.json())
      .then(updated => {
        setTasks(tsk => tsk.map(t => t.id === id ? updated : t));
        setShowComplete(null);
        setComment('');
        setCommentError('');
      });
  };

  const handleExtend = id => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:5000/api/tasks/${id}/extend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ deadline: newDeadline })
    })
      .then(r => r.json())
      .then(updated => {
        setTasks(tsk => tsk.map(t => t.id === id ? updated : t));
        setShowExtend(null);
        setNewDeadline('');
      });
  };

  const handleFileDownload = async (filename, originalName) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Downloading file:', filename, 'with token:', token ? 'present' : 'missing');
      
      const response = await fetch(`http://localhost:5000/api/download/${filename}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });

      console.log('Download response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Download error response:', errorText);
        throw new Error(`Ошибка при скачивании файла: ${response.status} ${errorText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = originalName || filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Ошибка скачивания файла:', error);
      alert(`Ошибка при скачивании файла: ${error.message}`);
    }
  };

  const viewTask = useMemo(() => {
    if (!viewTaskId) return null;
    return tasks.find(t => String(t.id) === String(viewTaskId) || String(t._id) === String(viewTaskId));
  }, [tasks, viewTaskId]);

  const getDeadlineCountdown = (deadline) => {
    if (!deadline) return '';
    const now = new Date();
    const end = new Date(deadline);
    const diffMs = end - now;
    if (diffMs <= 0) return 'Дедлайн истёк';
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    let result = '';
    if (days > 0) result += `${days} ${days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'} `;
    if (hours > 0) result += `${hours} ${hours === 1 ? 'час' : hours < 5 ? 'часа' : 'часов'} `;
    if (minutes > 0) result += `${minutes} ${minutes === 1 ? 'минута' : minutes < 5 ? 'минуты' : 'минут'} `;
    return result.trim();
  };

  const modalDeadlineStr = viewTask && viewTask.deadline
    ? new Date(viewTask.deadline).toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    : '—';

  const deadlineCountdown = viewTask && viewTask.deadline ? getDeadlineCountdown(viewTask.deadline) : '';

  useEffect(() => {
    if (!viewTask || !viewTask.deadline) {
      setDeadlineTimer('');
      return;
    }
    
    // Если задача выполнена, не показываем таймер
    if (viewTask.status === 'completed' || viewTask.status === 'closed') {
      setDeadlineTimer('');
      return;
    }
    
    const updateTimer = () => {
      const deadline = new Date(viewTask.deadline);
      const now = new Date();
      const diffMs = deadline - now;
      if (diffMs > 0) {
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        setDeadlineTimer(`осталось ${hours}ч ${minutes}м ${seconds}с`);
      } else {
        setDeadlineTimer('просрочено');
      }
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [viewTask?.id, viewTask?.deadline, viewTask?.status]);

  return (
    <Wrapper>
      <Title>Задачи</Title>
      
      <StatsSection>
        <StatItem>
          <StatNumber color="#6dd5ed">{stats.total}</StatNumber>
          <StatLabel>Всего</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber color="#43e97b">{stats.completed}</StatNumber>
          <StatLabel>Выполнено</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber color="#f39c12">{stats.active}</StatNumber>
          <StatLabel>Активных</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber color="#e74c3c">{stats.high}</StatNumber>
          <StatLabel>Важных</StatLabel>
        </StatItem>
      </StatsSection>
      
      <TopBar>
        <TopBtnOutline onClick={()=>setShowSearchModal(true)} title="Поиск задач">
          <span style={{fontSize:18}}>🔍</span>
          Поиск задач
        </TopBtnOutline>

        {(filter==='all')
          ? <TopBtn onClick={()=>setFilter('all')}>Все</TopBtn>
          : <TopBtnOutline onClick={()=>setFilter('all')}>Все</TopBtnOutline>}

        {(filter==='open')
          ? <TopBtn onClick={()=>setFilter('open')}>Открытые</TopBtn>
          : <TopBtnOutline onClick={()=>setFilter('open')}>Открытые</TopBtnOutline>}

        {(filter==='completed')
          ? <TopBtn onClick={()=>setFilter('completed')}>Выполненные</TopBtn>
          : <TopBtnOutline onClick={()=>setFilter('completed')}>Выполненные</TopBtnOutline>}

        {(priorityFilter==='all')
          ? <TopBtn onClick={()=>setPriorityFilter('all')}><FaFilter /> Все приоритеты</TopBtn>
          : <TopBtnOutline onClick={()=>setPriorityFilter('all')}><FaFilter /> Все приоритеты</TopBtnOutline>}

        {(priorityFilter==='high')
          ? <TopBtn onClick={()=>setPriorityFilter('high')}>Высокий</TopBtn>
          : <TopBtnOutline onClick={()=>setPriorityFilter('high')}>Высокий</TopBtnOutline>}

        {(priorityFilter==='medium')
          ? <TopBtn onClick={()=>setPriorityFilter('medium')}>Средний</TopBtn>
          : <TopBtnOutline onClick={()=>setPriorityFilter('medium')}>Средний</TopBtnOutline>}

        {(priorityFilter==='low')
          ? <TopBtn onClick={()=>setPriorityFilter('low')}>Низкий</TopBtn>
          : <TopBtnOutline onClick={()=>setPriorityFilter('low')}>Низкий</TopBtnOutline>}

        <TopBtn onClick={()=>setShowCreateModal(true)}>Создать задачу</TopBtn>
        {user?.role === 'admin' && (
          <DangerBtn onClick={handleClearCompleted}>Очистить выполненные</DangerBtn>
        )}
      </TopBar>

      {/* ...existing code... */}
      {loading && <div style={{color:'#2193b0',margin:'18px 0',fontWeight:600}}>Загрузка...</div>}
      <CardList>
        {filtered.length === 0 && !loading && (
          <li style={{color:'#888',fontWeight:600,fontSize:'1.08em',textAlign:'center',padding:'24px 0'}}>Нет задач по выбранному фильтру</li>
        )}
        {filtered.map(t => {
          // Получаем автора задачи
          const authorUser = users.find(u => String(u.id) === String(t.authorId));
          // Краткое описание: первые 3 слова
          const shortDesc = t.description ? t.description.split(/\s+/).slice(0,3).join(' ') + (t.description.split(/\s+/).length > 3 ? '...' : '') : '';

          const miniTimer = miniTimers[t.id] || '';
          
          // Обработчики свайпа для мобильной версии
          const handleTaskSwipeStart = (e) => {
            if (!isMobile) return;
            e.stopPropagation();
            setSwipeData(prev => ({
              ...prev,
              [t.id]: { startX: e.touches[0].clientX }
            }));
          };

          const handleTaskSwipeMove = (e) => {
            if (!isMobile || !swipeData[t.id]) return;
            e.stopPropagation();
          };

          const handleTaskSwipeEnd = (e) => {
            if (!isMobile || !swipeData[t.id]) return;
            e.stopPropagation();
            const endX = e.changedTouches[0].clientX;
            const startX = swipeData[t.id].startX;
            const distance = endX - startX;
            const minSwipeDistance = 50;

            if (distance > minSwipeDistance) {
              // Свайп вправо - открываем задачу
              setViewTaskId(t.id);
            }

            setSwipeData(prev => {
              const next = { ...prev };
              delete next[t.id];
              return next;
            });
          };

          return (
            <Card 
              key={t.id} 
              priority={t.priority}
              onTouchStart={isMobile ? handleTaskSwipeStart : undefined}
              onTouchMove={isMobile ? handleTaskSwipeMove : undefined}
              onTouchEnd={isMobile ? handleTaskSwipeEnd : undefined}
              style={isMobile ? { cursor: 'pointer' } : {}}
            >
              <CardInfo>
                {authorUser && authorUser.avatar
                  ? <img src={authorUser.avatar} alt="avatar" style={{width:32,height:32,borderRadius:6,objectFit:'cover'}} />
                  : <FaUserCircle size={32} color="#b2bec3" title="Аватар" />}
                <div style={{display:'flex',flexDirection:'column',gap:2,flex:1}}>
                  <span style={{fontSize:'0.7rem',color:'#b2bec3'}}>
                    Задача от {authorUser ? `${authorUser.firstName || ''} ${authorUser.lastName || ''}`.trim() || authorUser.username || 'Неизвестный' : 'Неизвестный'}
                  </span>
                  <CardTitle>{t.title}</CardTitle>
                </div>
                {/* Текст задачи показывается только в горизонтальной ориентации на мобильных или всегда на десктопе */}
                {(!isMobile || (isMobile && isLandscape)) && (
                <CardDesc>{shortDesc}</CardDesc>
                )}
                <PriorityBadge priority={t.priority}>
                  {t.priority === 'high' ? 'Высокий' :
                   t.priority === 'medium' ? 'Средний' : 'Низкий'}
                </PriorityBadge>
              </CardInfo>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <span style={{
                  padding:'4px 8px',
                  borderRadius:8,
                  background:'rgba(255,255,255,0.06)',
                  color:'#e2e8f0',
                  fontWeight:600,
                  fontSize:'0.8rem',
                  boxShadow:'0 3px 9px rgba(2,6,23,0.25)',
                  border:'1px solid rgba(255,255,255,0.08)',
                  display:'inline-flex',
                  alignItems:'center',
                  gap:'6px',
                  position:'relative'
                }}>
                  🕒 {t.deadline ? new Date(t.deadline).toLocaleString('ru-RU', { day:'2-digit', month:'2-digit', year:'2-digit', hour:'2-digit', minute:'2-digit' }) : '—'}
                  {t.deadline && t.status !== 'completed' && t.status !== 'closed' && (
                    <span style={{
                      marginLeft:8,
                      fontWeight:600,
                      padding:'3px 6px',
                      borderRadius:'6px',
                      background: miniTimer==='просрочено'
                        ? 'linear-gradient(90deg,#ef4444 0%,#f59e0b 100%)'
                        : 'linear-gradient(90deg,#7c3aed 0%, #3b82f6 100%)',
                      color:'#eef2ff',
                      fontSize:'0.7rem',
                      boxShadow:'0 4px 11px rgba(99,102,241,0.35)',
                      border:'1px solid rgba(255,255,255,0.06)',
                      display:'inline-block',
                      minWidth:'70px',
                      textAlign:'center'
                    }}>
                      {miniTimer==='просрочено' ? '⏰ Просрочено' : miniTimer}
                    </span>
                  )}
                </span>

                <span style={{
                  padding: isMobile && !isLandscape ? '6px' : '4px 8px',
                  borderRadius:8,
                  background: (t.status==='completed'||t.status==='closed')
                    ? 'linear-gradient(90deg,#16a34a,#22c55e)'
                    : 'linear-gradient(90deg,#7c3aed,#3b82f6)',
                  color:'#eef2ff',
                  fontWeight:600,
                  fontSize: isMobile && !isLandscape ? '1.2rem' : '0.8rem',
                  boxShadow:'0 4px 11px rgba(99,102,241,0.35)',
                  border:'1px solid rgba(255,255,255,0.06)',
                  display:'inline-flex',
                  alignItems:'center',
                  justifyContent: 'center',
                  gap: isMobile && !isLandscape ? '0' : '4px',
                  minWidth: isMobile && !isLandscape ? '40px' : 'auto',
                  minHeight: isMobile && !isLandscape ? '40px' : 'auto',
                  transition: 'all 0.3s ease'
                }}
                title={isMobile && !isLandscape && (t.status==='completed'||t.status==='closed') && t.completedAt 
                  ? new Date(t.completedAt).toLocaleDateString('ru-RU') 
                  : undefined}
                >
                  {t.status==='completed'||t.status==='closed' ? <span style={{fontSize:'0.8em'}}>✔️</span> : <span style={{fontSize:'0.8em'}}>⏳</span>}
                  {(isMobile && !isLandscape) ? '' : (
                    t.status==='completed'||t.status==='closed' ? 
                    (t.completedAt ? new Date(t.completedAt).toLocaleDateString('ru-RU') : 'Выполнена') : 
                      'Открыта'
                  )}
                </span>
                {/* Кнопки показываются только в горизонтальной ориентации на мобильных или всегда на десктопе */}
                {(!isMobile || (isMobile && isLandscape)) && (
                <div style={{display:'flex',gap:6}}>
                  <button 
                    style={{
                      padding:'6px 12px',
                      background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color:'#fff',
                      border:'none',
                      borderRadius:8,
                      cursor:'pointer',
                      fontWeight:600,
                      fontSize:'0.8rem',
                      display:'flex',
                      alignItems:'center',
                      gap:'4px'
                    }} 
                    onClick={()=>{
                      setViewTaskId(t.id);
                    }}
                  >
                    Открыть
                  </button>
                  {(t.status==='completed'||t.status==='closed') && (
                    <button 
                      style={{
                        padding:'6px 12px',
                        background:'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        color:'#fff',
                        border:'none',
                        borderRadius:8,
                        cursor:'pointer',
                        fontWeight:600,
                        fontSize:'0.8rem',
                        display:'flex',
                        alignItems:'center',
                        gap:'4px'
                      }} 
                      onClick={()=>setShowComment(t.id)}
                    >
                      Комментарий
                    </button>
                  )}
                </div>
                )}
              </div>
            </Card>
          );
        })}
            </CardList>

      {showCreateModal && (
        <ModalBg onClose={()=>{setShowCreateModal(false);}}>
          <div style={{
            background:'rgba(44, 62, 80, 0.95)',
            border:'none',
            borderRadius:16,
            boxShadow:'0 20px 60px rgba(0,0,0,0.3)',
            padding:'32px',
            color:'#fff',
            width:'min(1110px, 90vw)',
            maxHeight:'85vh',
            margin:'20px auto',
            position:'relative',
            overflow:'hidden',
            display:'flex',
            flexDirection:'column'
          }}>
            <h3 style={{color:'#6dd5ed',margin:'0 0 24px 0',fontWeight:800,fontSize:'1.8rem',textAlign:'left'}}>📝 Создать задачу</h3>
            <div style={{flex:1,overflowY:'auto',maxHeight:'75vh',paddingRight:'8px'}}>
              <Form onSubmit={handleSubmit} style={{padding:'0',marginBottom:8,gap:12,display:'flex',flexDirection:'column',alignItems:'stretch',width:'100%'}}>
              <div style={{display:'flex',gap:8,width:'100%',flexWrap:'wrap',justifyContent:'flex-start'}}>
                <Input name="title" placeholder="Заголовок" value={form.title} onChange={handleChange} required style={{flex:'1 1 320px',background:'rgba(17,24,39,0.65)',border:'1px solid rgba(255,255,255,0.14)',color:'#e5e7eb',height:48}} />
                <textarea
                  name="description"
                  placeholder="Описание"
                  value={form.description}
                  onChange={handleChange}
                  required
                  style={{
                    width:'100%',
                    minHeight:240,
                    borderRadius:12,
                    border:'1px solid rgba(255,255,255,0.14)',
                    background:'rgba(17,24,39,0.65)',
                    color:'#e5e7eb',
                    padding:14,
                    boxSizing:'border-box',
                    fontSize:'1.02em',
                    height: '260px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{display:'flex',gap:10,width:'100%',flexWrap:'wrap',justifyContent:'flex-start',alignItems:'stretch'}}>
                <div style={{position:'relative', width:'100%', maxWidth:360}}>
                  <Input
                    placeholder={assigneeSelectedLabel ? assigneeSelectedLabel : 'Исполнитель'}
                    value={assigneeQuery}
                    onChange={e=>{ setAssigneeQuery(e.target.value); setAssigneeOpen(true); setAssigneeHighlight(0); }}
                    onFocus={()=> setAssigneeOpen(true)}
                    onBlur={()=> setTimeout(()=> setAssigneeOpen(false), 150)}
                    onKeyDown={(e)=>{
                      const len = (filteredAssignees||[]).length;
                      if(!len) return;
                      if(e.key==='ArrowDown'){ e.preventDefault(); setAssigneeHighlight(h=> Math.min(h+1, len-1)); }
                      if(e.key==='ArrowUp'){ e.preventDefault(); setAssigneeHighlight(h=> Math.max(h-1, 0)); }
                      if(e.key==='Enter'){
                        e.preventDefault();
                        const u = filteredAssignees[assigneeHighlight];
                        if(u){ setForm(prev=>({...prev, assignedTo: u.id})); setAssigneeQuery(getAssigneeLabel(u)); setAssigneeOpen(false); }
                      }
                      if(e.key==='Escape'){ setAssigneeOpen(false); }
                    }}
                    style={{height:48}}
                  />
                  {assigneeOpen && (
                    <ul style={{position:'absolute', top:52, left:0, right:0, background:'rgba(17,24,39,0.98)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:12, boxShadow:'0 12px 28px rgba(2,6,23,0.5)', margin:0, padding:'6px', listStyle:'none', maxHeight:260, overflowY:'auto', zIndex:5}}>
                      {filteredAssignees && filteredAssignees.length === 0 && (
                        <li style={{padding:'10px 12px', color:'#94a3b8'}}>Ничего не найдено</li>
                      )}
                      {(filteredAssignees||[]).map((u, idx)=>{
                        const active = idx === assigneeHighlight;
                        return (
                          <li key={u.id}
                              onMouseEnter={()=>setAssigneeHighlight(idx)}
                              onMouseDown={(e)=>{ e.preventDefault(); setForm(prev=>({...prev, assignedTo: u.id})); setAssigneeQuery(getAssigneeLabel(u)); setAssigneeOpen(false); }}
                              style={{padding:'10px 12px', borderRadius:10, cursor:'pointer', background: active? 'rgba(124,58,237,0.18)' : 'transparent', color:'#e2e8f0'}}>
                            {getAssigneeLabel(u)}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
                <Input name="deadline" type="datetime-local" value={form.deadline} onChange={handleChange} required style={{minWidth:200,height:48,background:'rgba(17,24,39,0.65)',border:'1px solid rgba(255,255,255,0.14)',color:'#e5e7eb'}} />
                <PrioritySelect name="priority" value={form.priority} onChange={handleChange} style={{minWidth:140,height:48}}>
                  <option value="low">Низкий</option>
                  <option value="medium">Средний</option>
                  <option value="high">Высокий</option>
                </PrioritySelect>
                <label htmlFor="file-upload" style={{
                  background:'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
                  color:'#fff',
                  border:'none',
                  borderRadius:8,
                  padding:'6px 10px',
                  cursor:'pointer',
                  display:'inline-flex',
                  alignItems:'center',
                  gap:6,
                  transition:'background .18s',
                  width:'auto',
                  maxWidth:200,
                  boxSizing:'border-box',
                  fontSize:'0.8em',
                  fontWeight:600
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M16.5 12a.75.75 0 0 1 .75.75v5.5A2.75 2.75 0 0 1 14.5 21h-5A2.75 2.75 0 0 1 6.75 18.25v-5.5a.75.75 0 0 1 1.5 0v5.5c0 .69.56 1.25 1.25 1.25h5c.69 0 1.25-.56 1.25-1.25v-5.5a.75.75 0 0 1 .75-.75Zm-4.22-7.53a.75.75 0 0 1 1.44 0l2.25 6.5a.75.75 0 0 1-1.44.46l-.53-1.53H9.5l-.53 1.53a.75.75 0 0 1-1.44-.46l2.25-6.5ZM12 5.62 10.9 8.5h2.2L12 5.62Z"/></svg>
                  <span>Добавить файл</span>
                  <input id="file-upload" type="file" multiple onChange={handleFileChange} style={{display:'none'}} />
                </label>
              </div>

              {/* Список выбранных файлов */}
              {files && files.length > 0 && (
                <div style={{marginTop:-10,marginBottom:10,width:'100%'}}>
                  <ul style={{listStyle:'none',padding:0,margin:0,display:'flex',flexWrap:'wrap',gap:8}}>
                    {files.map((file, idx) => {
                      const ext = file.name.split('.').pop().toLowerCase();
                      const icon = fileIconMap[ext] || fileIconMap.default;
                      return (
                        <li key={file.name+idx} style={{background:'#eafaf1',border:'1px solid #43e97b55',borderRadius:8,padding:'4px 10px',display:'flex',alignItems:'center',gap:8}}>
                          <img src={icon} alt={ext} style={{width:24,height:24,objectFit:'contain'}} />
                          <span style={{color:'#2193b0',fontWeight:600}}>{file.name}</span>
                          <button type="button" onClick={()=>handleRemoveFile(idx)} style={{background:'none',border:'none',color:'#e74c3c',fontWeight:700,fontSize:'1.1em',cursor:'pointer',marginLeft:4}} title="Удалить файл">×</button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              <div style={{display:'flex',gap:6,width:'100%',flexWrap:'nowrap',justifyContent:'flex-end'}}>
                <Button type="button" onClick={()=>setShowCreateModal(false)} style={{height:32,padding:'0 10px',fontSize:'0.8em',fontWeight:700,borderRadius:8,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',boxShadow:'none',color:'#e2e8f0'}}>Отмена</Button>
                <Button type="submit" style={{height:32,padding:'0 12px',fontSize:'0.8em',fontWeight:700,borderRadius:8,background:'linear-gradient(90deg,#7c3aed 0%, #3b82f6 100%)',boxShadow:'0 4px 12px rgba(99,102,241,0.25)'}}>Отправить</Button>
              </div>
              </Form>
            </div>
          </div>
        </ModalBg>
      )}

      {showComplete && (
        <ModalBg onClose={()=>{setShowComplete(null);setComment('');setCommentError('');}}>
          <div style={{
            maxWidth:'520px',minWidth:'320px',
            background:'rgba(17,24,39,0.75)', border:'1px solid rgba(255,255,255,0.08)',
            borderRadius:'16px', boxShadow:'0 20px 60px rgba(2,6,23,0.45)',
            padding:'28px 22px 22px 22px', margin:'60px auto',
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            position:'relative', zIndex:10000
          }}>
            <h3 style={{color:'#e2e8f0',marginBottom:16,fontSize:'1.12em',textAlign:'center'}}>Комментарий к выполнению задачи</h3>
            <textarea
              value={comment}
              onChange={e=>{setComment(e.target.value);setCommentError('');}}
              placeholder="Опишите, как была выполнена задача..."
              style={{
                width:'100%',
                minHeight:96,
                borderRadius:12,
                border: commentError ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.14)',
                background:'rgba(17,24,39,0.65)',
                color:'#e5e7eb',
                padding:12
              }}
            />
            {commentError && (
              <div style={{
                color:'#ef4444',
                fontSize:'0.9rem',
                marginTop:8,
                textAlign:'center',
                fontWeight:600
              }}>
                {commentError}
              </div>
            )}
            <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:6}}>
              <button type="button" onClick={()=>{setShowComplete(null);setComment('');setCommentError('');}} style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',color:'#e2e8f0',borderRadius:10,padding:'8px 14px',fontWeight:700,cursor:'pointer'}}>Отмена</button>
              <Button style={{padding:'8px 16px',fontWeight:800}} onClick={()=>handleComplete(showComplete)}>Отправить</Button>
            </div>
          </div>
        </ModalBg>
      )}

      {showExtend && (
        <ModalBg onClose={()=>{setShowExtend(null);setNewDeadline('');}}>
          <div style={{
            maxWidth:'480px', minWidth:'300px',
            background:'rgba(17,24,39,0.75)', border:'1px solid rgba(255,255,255,0.08)',
            borderRadius:'16px', boxShadow:'0 20px 60px rgba(2,6,23,0.45)',
            padding:'24px 22px 22px 22px', margin:'40px auto', display:'flex', flexDirection:'column', gap:12
          }}>
            <h3 style={{color:'#e2e8f0',margin:0,fontSize:'1.12em',textAlign:'center'}}>Продлить дедлайн</h3>
            <input
              type="datetime-local"
              value={newDeadline}
              onChange={e=>setNewDeadline(e.target.value)}
              style={{width:'100%',borderRadius:12,border:'1px solid rgba(255,255,255,0.14)',background:'rgba(17,24,39,0.65)',color:'#e5e7eb',padding:10}}
            />
            <Button onClick={()=>handleExtend(showExtend)} style={{width:'100%'}}>Продлить</Button>
          </div>
        </ModalBg>
      )}

      {viewTask && (
        <ModalBg onClose={()=>setViewTaskId(null)}>
          {console.log('Rendering modal for task:', viewTask)}
          <div
            style={{
              background:'rgba(44, 62, 80, 0.95)',
              border:'none',
              borderRadius:16,
              boxShadow:'0 20px 60px rgba(0,0,0,0.3)',
              padding:'32px',
              color:'#fff',
              width:'min(800px, 90vw)',
              margin:'20px auto',
              position:'relative',
              overflow:'hidden',
              transform:'translateX(20px)'
            }}
          >
            <div style={{fontWeight:700,fontSize:'1.4rem',color:'#6dd5ed',marginBottom:16}}>
              {viewTask.title || 'Без заголовка'}
            </div>
            <div style={{fontSize:'1rem',color:'#b2bec3',marginBottom:24,whiteSpace:'pre-line',lineHeight:1.5}}>
              {viewTask.description || 'Без описания'}
            </div>

            {/* Аватар + исполнитель */}
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20,padding:'12px 16px',background:'rgba(44, 62, 80, 0.3)',borderRadius:12}}>
              {(() => {
                try {
                  const assignee = (Array.isArray(users) ? users : []).find(u => String(u.id) === String(viewTask.assignedTo));
                  const avatar = assignee?.avatar || viewTask.assignedToAvatar || viewTask.authorAvatar;
                  return avatar
                    ? <img src={avatar} alt="avatar" style={{width:40,height:40,borderRadius:8,objectFit:'cover'}} />
                    : <FaUserCircle size={40} color="#b2bec3" title="Аватар" />;
                } catch { return <FaUserCircle size={40} color="#b2bec3" title="Аватар" />; }
              })()}
              <span style={{fontWeight:600,fontSize:'1rem',color:'#6dd5ed'}}>
                Исполнитель: {(() => { const assignee = (Array.isArray(users) ? users : []).find(u => String(u.id) === String(viewTask.assignedTo)); return assignee?.username || viewTask.assignedToUsername || viewTask.authorUsername || '—'; })()}
              </span>
            </div>

            {/* Файлы задачи */}
            {(() => {
              try {
                
                // Попробуем разные варианты полей для файлов
                let files = [];
                if (viewTask.file_info) {
                  files = JSON.parse(viewTask.file_info);
                } else if (viewTask.files) {
                  files = Array.isArray(viewTask.files) ? viewTask.files : JSON.parse(viewTask.files);
                } else if (viewTask.attachments) {
                  files = Array.isArray(viewTask.attachments) ? viewTask.attachments : JSON.parse(viewTask.attachments);
                }
                
                if (!Array.isArray(files) || files.length === 0) {
                  return (
                    <div style={{marginBottom:20,padding:'12px 16px',background:'rgba(44, 62, 80, 0.3)',borderRadius:8}}>
                      <span style={{color:'#b2bec3',fontSize:'0.9rem'}}>Файлы не прикреплены</span>
                    </div>
                  );
                }
                return (
                  <div style={{marginBottom:20}}>
                    <h4 style={{color:'#6dd5ed',fontSize:'1rem',fontWeight:600,marginBottom:12}}>Прикрепленные файлы</h4>
                    <div style={{display:'flex',flexDirection:'column',gap:8}}>
                      {files.map((f, idx) => {
                        const ext = (f.originalname || f.name || '').split('.').pop()?.toLowerCase();
                        const sizeKb = f.size ? (f.size/1024).toFixed(1) : '';
                        const fileName = f.originalname || f.name || f.filename || 'file';
                        const downloadUrl = f.filename ? `http://localhost:5000/api/download/${f.filename}` : 
                                          f.url ? f.url : '#';
                        return (
                          <div key={idx} style={{background:'rgba(44, 62, 80, 0.3)',borderRadius:8,padding:'12px 16px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
                            <div style={{display:'flex',alignItems:'center',gap:12,minWidth:0,flex:1}}>
                              <img 
                                src={getFileIcon(fileName)} 
                                alt="file icon" 
                                style={{width:32,height:32,borderRadius:6,objectFit:'contain'}}
                                onError={(e) => {
                                  // Fallback к текстовому обозначению если иконка не загрузилась
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'inline-flex';
                                }}
                              />
                              <span style={{width:32,height:32,borderRadius:6,display:'none',alignItems:'center',justifyContent:'center',background:'rgba(109, 213, 237, 0.2)',color:'#6dd5ed',fontWeight:600,fontSize:'0.7rem'}}>
                                {(ext||'?').slice(0,3).toUpperCase()}
                              </span>
                              <div style={{minWidth:0,flex:1}}>
                                <div style={{color:'#fff',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                                  {decodeURIComponent(fileName)}
                                </div>
                                {sizeKb && <div style={{color:'#b2bec3',fontSize:'0.8rem'}}>{sizeKb} КБ</div>}
                              </div>
                            </div>
                            <button
                              onClick={() => handleFileDownload(f.filename, fileName)}
                              style={{
                                padding:'6px 12px',
                                background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color:'#fff',
                                border:'none',
                                borderRadius:6,
                                fontSize:'0.8rem',
                                fontWeight:600,
                                transition:'all 0.2s',
                                cursor:'pointer'
                              }}
                            >
                              Скачать
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              } catch { return null; }
            })()}

            {/* Дедлайн + таймер */}
            <div style={{marginBottom:20,padding:'12px 16px',background:'rgba(44, 62, 80, 0.3)',borderRadius:12}}>
              <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
                <span style={{fontSize:'1rem',color:'#6dd5ed',fontWeight:600}}>
                  🕒 Дедлайн: {modalDeadlineStr}
                </span>
                {deadlineTimer && (
                  <span style={{padding:'4px 8px',borderRadius:6,background: deadlineTimer==='просрочено' ? '#e74c3c' : '#f39c12',color:'#fff',fontSize:'0.8rem',fontWeight:600}}>
                    {deadlineTimer === 'просрочено' ? '⏰ Просрочено' : deadlineTimer}
                  </span>
                )}
              </div>
            </div>

            {/* Кнопки действий */}
            <div style={{display:'flex',gap:12,marginTop:20,flexWrap:'wrap'}}>
              {/* Показываем кнопку "Выполнить" только для незавершенных задач */}
              {viewTask.status !== 'completed' && viewTask.status !== 'closed' && (
                <button
                  style={{
                    padding:'10px 16px',
                    background:'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                    color:'#fff',
                    border:'none',
                    borderRadius:8,
                    cursor:'pointer',
                    fontWeight:600,
                    fontSize:'0.9rem',
                    display:'flex',
                    alignItems:'center',
                    gap:'6px',
                    transition:'all 0.2s'
                  }}
                  onClick={() => { 
                  setIsCompletionRequired(true);
                  setShowComplete(viewTask.id); 
                  setViewTaskId(null); 
                }}
                >
                  Выполнить
                </button>
              )}
              <button
                style={{
                  padding:'10px 16px',
                  background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color:'#fff',
                  border:'none',
                  borderRadius:8,
                  cursor:'pointer',
                  fontWeight:600,
                  fontSize:'0.9rem',
                  display:'flex',
                  alignItems:'center',
                  gap:'6px',
                  transition:'all 0.2s'
                }}
                onClick={() => { setShowExtend(viewTask.id); setViewTaskId(null); }}
              >
                Сдвинуть дедлайн
              </button>
              {state.user?.role === 'admin' && (
                <button
                  style={{
                    padding:'10px 16px',
                    background:'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color:'#fff',
                    border:'none',
                    borderRadius:8,
                    cursor:'pointer',
                    fontWeight:600,
                    fontSize:'0.9rem',
                    display:'flex',
                    alignItems:'center',
                    gap:'6px',
                    transition:'all 0.2s'
                  }}
                  onClick={() => handleDelete(viewTask.id)}
                >
                  Удалить
                </button>
              )}
            </div>
          </div>
        </ModalBg>
      )}

      {showComment && (
        <ModalBg onClose={()=>setShowComment(null)}>
          <div style={{maxWidth:'480px',minWidth:'300px',background:'rgba(17,24,39,0.75)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'16px',boxShadow:'0 20px 60px rgba(2,6,23,0.45)',padding:'28px 22px 22px 22px',margin:'60px auto',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',position:'relative',zIndex:10000}}>
            <h3 style={{color:'#e2e8f0',marginBottom:16,fontSize:'1.12em',textAlign:'center'}}>Комментарий к задаче</h3>
            <div style={{fontSize:'1.02em',color:'#cbd5e1',whiteSpace:'pre-line',maxHeight:'180px',overflowY:'auto',textAlign:'center',wordBreak:'break-word',padding:'8px 0'}}>
              {tasks.find(tt => String(tt.id) === String(showComment))?.completionComment || 'Комментарий отсутствует'}
            </div>
          </div>
        </ModalBg>
      )}

      {showSearchModal && !viewTask && (
        <ModalBg onClose={() => setShowSearchModal(false)}>
          <div
            style={{
              background:'rgba(44, 62, 80, 0.95)',
              border:'none',
              borderRadius:16,
              boxShadow:'0 20px 60px rgba(0,0,0,0.3)',
              padding:'32px',
              color:'#fff',
              width:'min(1110px, 90vw)',
              maxHeight:'85vh',
              margin:'20px auto',
              position:'relative',
              overflow:'hidden',
              display:'flex',
              flexDirection:'column'
            }}
          >
            <h3 style={{color:'#6dd5ed',margin:'0 0 24px 0',fontWeight:800,fontSize:'1.8rem',textAlign:'left'}}>🔍 Поиск задач</h3>

            <div style={{display:'flex',gap:16,flexWrap:'wrap',alignItems:'center',marginBottom:24}}>
              <div style={{position:'relative', flex:'1', minWidth:280}}>
                <Input
                  placeholder={'Введите имя пользователя...'}
                  value={searchQuery}
                  onChange={e=>{ setSearchQuery(e.target.value); setSearchOpen(true); setSearchHighlight(0); }}
                  onFocus={()=> setSearchOpen(true)}
                  onBlur={()=> setTimeout(()=> setSearchOpen(false), 150)}
                  onKeyDown={(e)=>{
                    const len = (filteredSearchUsers||[]).length;
                    if(!len) return;
                    if(e.key==='ArrowDown'){ e.preventDefault(); setSearchHighlight(h=> Math.min(h+1, len-1)); }
                    if(e.key==='ArrowUp'){ e.preventDefault(); setSearchHighlight(h=> Math.max(h-1, 0)); }
                    if(e.key==='Enter'){
                      e.preventDefault();
                      const u = filteredSearchUsers[searchHighlight];
                      if(u){ setSearchUserId(String(u.id)); setSearchQuery(u.username || u.displayName || u.email || String(u.id)); setSearchDate(''); setSearchOpen(false); }
                    }
                    if(e.key==='Escape'){ setSearchOpen(false); }
                  }}
                  style={{height:48}}
                />
                {searchOpen && (
                  <ul style={{position:'absolute', top:52, left:0, right:0, background:'rgba(44, 62, 80, 0.98)', border:'1px solid rgba(109, 213, 237, 0.3)', borderRadius:12, boxShadow:'0 12px 28px rgba(0,0,0,0.4)', margin:0, padding:'8px', listStyle:'none', maxHeight:260, overflowY:'auto', zIndex:5}}>
                    {filteredSearchUsers && filteredSearchUsers.length === 0 && (
                      <li style={{padding:'12px 16px', color:'#b2bec3'}}>Ничего не найдено</li>
                    )}
                    {(filteredSearchUsers||[]).map((u, idx)=>{
                      const active = idx === searchHighlight;
                      const firstName = u.firstName || u.firstname || '';
                      const lastName = u.lastName || u.lastname || '';
                      const display = u.displayName || u.display || [firstName, lastName].filter(Boolean).join(' ').trim();
                      const login = u.login || u.username || '';
                      const label = (display || login || u.email || String(u.id)).trim();
                      return (
                        <li key={u.id}
                            onMouseEnter={()=>setSearchHighlight(idx)}
                            onMouseDown={(e)=>{ e.preventDefault(); setSearchUserId(String(u.id)); setSearchQuery(label); setSearchDate(''); setSearchOpen(false); }}
                            style={{padding:'12px 16px', borderRadius:8, cursor:'pointer', background: active? 'rgba(109, 213, 237, 0.2)' : 'transparent', color:'#fff', transition:'all 0.2s'}}>
                          {label}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              <input 
                type="date" 
                value={searchDate} 
                onChange={e=>setSearchDate(e.target.value)} 
                style={{
                  height:48,
                  padding:'0 16px',
                  borderRadius:8,
                  border:'1px solid rgba(109, 213, 237, 0.3)',
                  background:'rgba(44, 62, 80, 0.5)',
                  color:'#fff',
                  fontSize:'0.9rem'
                }} 
              />
              <div style={{display:'inline-flex',border:'1px solid rgba(109, 213, 237, 0.3)',borderRadius:8,overflow:'hidden',height:48,alignItems:'stretch'}}>
                <button 
                  type="button" 
                  onClick={()=>setSearchRole('assignee')} 
                  style={{
                    padding:'0 16px',
                    fontWeight:600,
                    cursor:'pointer',
                    background: searchRole==='assignee' ? 'linear-gradient(135deg, #6dd5ed 0%, #2193b0 100%)' : 'rgba(44, 62, 80, 0.5)', 
                    color: '#fff', 
                    border:'none',
                    fontSize:'0.9rem',
                    transition:'all 0.2s'
                  }}
                >
                  Исполнитель
                </button>
                <button 
                  type="button" 
                  onClick={()=>setSearchRole('author')} 
                  style={{
                    padding:'0 16px',
                    fontWeight:600,
                    cursor:'pointer',
                    background: searchRole==='author' ? 'linear-gradient(135deg, #6dd5ed 0%, #2193b0 100%)' : 'rgba(44, 62, 80, 0.5)', 
                    color: '#fff', 
                    border:'none',
                    fontSize:'0.9rem',
                    transition:'all 0.2s'
                  }}
                >
                  Автор
                </button>
              </div>
              <button 
                onClick={()=>{setSearchUserId(''); setSearchQuery(''); setSearchDate('');}} 
                style={{
                  height:48,
                  padding:'0 16px',
                  borderRadius:8,
                  border:'1px solid rgba(109, 213, 237, 0.3)',
                  background:'rgba(44, 62, 80, 0.5)',
                  color:'#fff',
                  fontWeight:600,
                  cursor:'pointer',
                  fontSize:'0.9rem',
                  transition:'all 0.2s'
                }}
              >
                Сбросить
              </button>
            </div>

            <div style={{flex:1,overflowY:'auto',maxHeight:'75vh',paddingRight:'8px'}}>
              {searchResults.length === 0 ? (
                <div style={{
                  color:'#b2bec3',
                  fontWeight:600,
                  fontSize:'1.1rem',
                  textAlign:'center',
                  padding:'40px 20px',
                  background:'rgba(44, 62, 80, 0.3)',
                  borderRadius:8,
                  border:'1px solid rgba(255,255,255,0.08)'
                }}>
                  📭 Нет задач по выбранным параметрам
                </div>
              ) : (
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  {searchResults.map(t => {
                    const authorUser = (Array.isArray(users)?users:[]).find(u => String(u.id) === String(t.authorId));
                    const priorityColor = t.priority === 'high' ? '#e74c3c' : t.priority === 'low' ? '#27ae60' : '#f39c12';
                    const shortDesc = t.description ? t.description.split(/\s+/).slice(0,3).join(' ') + (t.description.split(/\s+/).length > 3 ? '...' : '') : '';
                    
                    // Обработчики свайпа для мобильной версии в модалке поиска
                    const handleSearchTaskSwipeStart = (e) => {
                      if (!isMobile) return;
                      e.stopPropagation();
                      setSwipeData(prev => ({
                        ...prev,
                        [`search_${t.id}`]: { startX: e.touches[0].clientX }
                      }));
                    };

                    const handleSearchTaskSwipeMove = (e) => {
                      if (!isMobile || !swipeData[`search_${t.id}`]) return;
                      e.stopPropagation();
                    };

                    const handleSearchTaskSwipeEnd = (e) => {
                      if (!isMobile || !swipeData[`search_${t.id}`]) return;
                      e.stopPropagation();
                      const endX = e.changedTouches[0].clientX;
                      const startX = swipeData[`search_${t.id}`].startX;
                      const distance = endX - startX;
                      const minSwipeDistance = 50;

                      if (distance > minSwipeDistance) {
                        // Свайп вправо - открываем задачу
                        setViewTaskId(t.id);
                        setShowSearchModal(false);
                      }

                      setSwipeData(prev => {
                        const next = { ...prev };
                        delete next[`search_${t.id}`];
                        return next;
                      });
                    };
                    
                    return (
                      <div 
                        key={t.id} 
                        style={{
                          display:'flex',
                          flexDirection:'row',
                          alignItems:'center',
                          gap:8,
                          padding:'12px 16px',
                          background:'rgba(44, 62, 80, 0.3)',
                          borderRadius:8,
                          borderLeft:`3px solid ${priorityColor}`,
                          transition:'all 0.2s',
                          minHeight:80,
                          cursor: isMobile ? 'pointer' : 'default'
                        }}
                        onTouchStart={isMobile ? handleSearchTaskSwipeStart : undefined}
                        onTouchMove={isMobile ? handleSearchTaskSwipeMove : undefined}
                        onTouchEnd={isMobile ? handleSearchTaskSwipeEnd : undefined}
                      >
                        <div style={{display:'flex',alignItems:'center',gap:8,flex:1}}>
                          {authorUser && authorUser.avatar
                            ? <img src={authorUser.avatar} alt="avatar" style={{width:32,height:32,borderRadius:6,objectFit:'cover'}} />
                            : <FaUserCircle size={32} color="#b2bec3" title="Аватар" />}
                          <div style={{display:'flex',flexDirection:'column',gap:2,flex:1}}>
                            <span style={{fontSize:'0.7rem',color:'#b2bec3'}}>
                              Задача от {authorUser ? `${authorUser.firstName || ''} ${authorUser.lastName || ''}`.trim() || authorUser.username || 'Неизвестный' : 'Неизвестный'}
                            </span>
                            <span style={{fontSize:'0.95rem',fontWeight:600,lineHeight:1.2,color:'#fff'}}>{t.title}</span>
                            {/* Текст задачи показывается только в горизонтальной ориентации на мобильных или всегда на десктопе */}
                            {(!isMobile || (isMobile && isLandscape)) && (
                          <span style={{fontSize:'0.8rem',color:'#b2bec3',lineHeight:1.2}}>{shortDesc}</span>
                            )}
                          </div>
                          <span style={{
                            padding:'4px 8px',
                            borderRadius:8,
                            background: t.priority === 'high' ? 'rgba(231, 76, 60, 0.2)' : 
                                       t.priority === 'low' ? 'rgba(39, 174, 96, 0.2)' : 'rgba(243, 156, 18, 0.2)',
                            color: priorityColor,
                            fontWeight:600,
                            fontSize:'0.8rem',
                            border:'1px solid rgba(255,255,255,0.08)',
                            display:'inline-flex',
                            alignItems:'center',
                            gap:'4px'
                          }}>
                            {t.priority === 'high' ? 'Высокий' :
                             t.priority === 'medium' ? 'Средний' : 'Низкий'}
                          </span>
                        </div>
                        <div style={{display:'flex',alignItems:'center',gap:8}}>
                          <span style={{
                            padding:'4px 8px',
                            borderRadius:8,
                            background:'rgba(255,255,255,0.06)',
                            color:'#e2e8f0',
                            fontWeight:600,
                            fontSize:'0.8rem',
                            boxShadow:'0 3px 9px rgba(2,6,23,0.25)',
                            border:'1px solid rgba(255,255,255,0.08)',
                            display:'inline-flex',
                            alignItems:'center',
                            gap:'6px',
                            position:'relative',
                            pointerEvents:'none'
                          }}>
                            🕒 {t.deadline ? new Date(t.deadline).toLocaleString('ru-RU', { day:'2-digit', month:'2-digit', year:'2-digit', hour:'2-digit', minute:'2-digit' }) : '—'}
                          </span>

                          {(t.status==='completed'||t.status==='closed') && t.completedAt ? (
                            <span style={{
                              padding:'4px 8px',
                              borderRadius:8,
                              background:'linear-gradient(90deg,#16a34a,#22c55e)',
                              color:'#eef2ff',
                              fontWeight:600,
                              fontSize:'0.8rem',
                              boxShadow:'0 4px 11px rgba(99,102,241,0.35)',
                              border:'1px solid rgba(255,255,255,0.06)',
                              display:'inline-flex',
                              alignItems:'center',
                              gap:'4px',
                              pointerEvents:'none'
                            }}>
                              <span style={{fontSize:'0.8em'}}>✔️</span>
                              {new Date(t.completedAt).toLocaleDateString('ru-RU')}
                            </span>
                          ) : (
                            <span style={{
                              padding:'4px 8px',
                              borderRadius:8,
                              background:'linear-gradient(90deg,#7c3aed,#3b82f6)',
                              color:'#eef2ff',
                              fontWeight:600,
                              fontSize:'0.8rem',
                              boxShadow:'0 4px 11px rgba(99,102,241,0.35)',
                              border:'1px solid rgba(255,255,255,0.06)',
                              display:'inline-flex',
                              alignItems:'center',
                              gap:'4px',
                              pointerEvents:'none'
                            }}>
                              <span style={{fontSize:'0.8em'}}>⏳</span>
                              Открыта
                            </span>
                          )}
                          {/* Кнопки показываются только в горизонтальной ориентации на мобильных или всегда на десктопе */}
                          {(!isMobile || (isMobile && isLandscape)) && (
                          <div style={{display:'flex',gap:6}}>
                            <button 
                              onClick={()=>{ setViewTaskId(t.id); }} 
                              style={{
                                padding:'6px 12px',
                                background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color:'#fff',
                                border:'none',
                                borderRadius:8,
                                cursor:'pointer',
                                fontWeight:600,
                                fontSize:'0.8rem',
                                display:'flex',
                                alignItems:'center',
                                gap:'4px'
                              }}
                            >
                              Открыть
                            </button>
                          </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </ModalBg>
      )}
    </Wrapper>
  );
}

export default Tasks;