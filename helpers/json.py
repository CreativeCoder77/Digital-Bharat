"""
JSON Helper Functions Library
============================

This library provides comprehensive utilities for working with JSON files in Python.

Core Functions:
- read_json, write_json: Basic file I/O operations
- get_value, set_value, update_nested: Read and write nested data
- key_exists, ensure_key: Key management utilities

List Operations:
- append_to_list, remove_from_list: Basic list operations
- filter_by_key_value, sort_list_by_key: Advanced list filtering and sorting
- count_entries: Count list items

Task Management:
- add_task: Add tasks with date/time/status support
- update_task_status: Update task status by identifier
- filter_tasks_by_status: Filter tasks by status and date
- list_all_statuses: Get all available status values

Data Manipulation:
- merge_json, deep_merge_json: Merge data structures
- flatten_json, unflatten_json: Convert between nested and flat structures
- increment_counter: Numeric operations

Utility Functions:
- backup_json: Create timestamped backups
- clear_json, delete_key, rename_key: File and key management
- get_all_keys: Retrieve all keys (nested or flat)
"""

import json
import os
from datetime import datetime
import shutil
from copy import deepcopy
import re


# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

def resolve_date_key(date):
    """
    Convert date parameter into a usable string date or None.
    
    Args:
        date: True (current date), str (specific date), or False/None
    
    Returns:
        str: Date in YYYY-MM-DD format or None
    """
    if date is True:
        return datetime.now().strftime("%Y-%m-%d")
    elif isinstance(date, str):
        return date
    return None


def resolve_time_key(time):
    """
    Convert time parameter into a usable string time or None.
    
    Args:
        time: True (current time), str (specific time), or False/None
    
    Returns:
        str: Time in HH:MM:SS format or None
    """
    if time is True:
        return datetime.now().strftime('%H:%M:%S')
    elif isinstance(time, str):
        return time
    return None


# ============================================================================
# CORE FILE OPERATIONS
# ============================================================================

def read_json(file_path, default=None):
    """
    Safely read a JSON file, creating it if it doesn't exist.

    Args:
        file_path (str): Path to JSON file
        default: Default value to return on error (defaults to empty dict)

    Returns:
        dict: Parsed JSON data or default value
    """
    if not os.path.exists(file_path):
        # Auto-create the file with default content
        default_data = default or {}
        with open(file_path, 'w') as f:
            json.dump(default_data, f, indent=4)
        return default_data

    try:
        with open(file_path, 'r') as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        # Optionally overwrite with default if corrupted
        default_data = default or {}
        with open(file_path, 'w') as f:
            json.dump(default_data, f, indent=4)
        return default_data


def write_json(path, data):
    """
    Write JSON to file with horizontal 'time_log' formatting.

    Args:
        path (str): File path
        data (dict): JSON data
    """
    # Step 1: Convert to pretty JSON
    raw = json.dumps(data, indent=4)

    # Step 2: Make time_log one-liner
    def convert_time_log(match):
        list_str = match.group(1)
        times = re.findall(r'"(.*?)"', list_str)
        return '"time_log": [{}]'.format(", ".join(f'"{t}"' for t in times))

    raw = re.sub(
        r'"time_log": \[(.*?)\]',
        convert_time_log,
        raw,
        flags=re.DOTALL
    )

    # Step 3: Ensure parent directory exists
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)

    # Step 4: Write to file
    with open(path, "w", encoding="utf-8") as file:
        file.write(raw)





def backup_json(file_path, backup_dir='backups'):
    """
    Create a timestamped backup of the JSON file.
    
    Args:
        file_path (str): Original file path
        backup_dir (str): Directory to store backups
    
    Returns:
        str: Path to backup file
    """
    if not os.path.exists(backup_dir):
        os.makedirs(backup_dir)
    base_name = os.path.basename(file_path)
    timestamp = datetime.now().strftime('%Y%m%d-%H%M%S')
    backup_file = os.path.join(backup_dir, f"{base_name}.{timestamp}.bak.json")
    shutil.copy(file_path, backup_file)
    return backup_file


def clear_json(file_path):
    """
    Clear entire JSON file and replace with empty object.
    
    Args:
        file_path (str): Path to JSON file
    """
    write_json(file_path, {})


# ============================================================================
# KEY AND VALUE OPERATIONS
# ============================================================================

def get_value(file_path, path_list, default=None):
    """
    Retrieve a nested value using a list of keys.
    
    Args:
        file_path (str): Path to JSON file
        path_list (list): List of keys to traverse
        default: Value to return if path doesn't exist
    
    Returns:
        Any: Value at the path or default
    
    Example:
        get_value('data.json', ['users', 'alice', 'score'], 0)
    """
    data = read_json(file_path, default={})
    ref = data
    for key in path_list:
        if isinstance(ref, dict) and key in ref:
            ref = ref[key]
        else:
            return default
    return ref


def set_value(file_path, key, value):
    """
    Set or replace a root-level key with a value.
    
    Args:
        file_path (str): Path to JSON file
        key (str): Key to set
        value: Value to assign
    """
    data = read_json(file_path, default={})
    data[key] = value
    write_json(file_path, data)


def update_nested(file_path, path_list, value):
    """
    Update a nested key path in the JSON file.
    
    Args:
        file_path (str): Path to JSON file
        path_list (list): List of keys to traverse
        value: Value to set at the path
    
    Example:
        update_nested('data.json', ['users', 'alice', 'score'], 100)
    """
    data = read_json(file_path, default={})
    ref = data
    for key in path_list[:-1]:
        if key not in ref or not isinstance(ref[key], dict):
            ref[key] = {}
        ref = ref[key]
    ref[path_list[-1]] = value
    write_json(file_path, data)


def key_exists(file_path, path_list):
    """
    Check if a nested key path exists.
    
    Args:
        file_path (str): Path to JSON file
        path_list (list): List of keys to check
    
    Returns:
        bool: True if path exists, False otherwise
    """
    data = read_json(file_path, default={})
    ref = data
    for key in path_list:
        if isinstance(ref, dict) and key in ref:
            ref = ref[key]
        else:
            return False
    return True


def ensure_key(file_path, key, default_value):
    """
    Ensure a key exists in the root of the JSON file.
    Creates the key with default_value if it doesn't exist.
    
    Args:
        file_path (str): Path to JSON file
        key (str): Key to ensure exists
        default_value: Value to set if key doesn't exist
    """
    data = read_json(file_path, default={})
    if key not in data:
        data[key] = default_value
        write_json(file_path, data)


def delete_key(file_path, key):
    """
    Delete a root-level key from the JSON file if it exists.
    
    Args:
        file_path (str): Path to JSON file
        key (str): Key to delete
    """
    data = read_json(file_path, default={})
    if key in data:
        del data[key]
        write_json(file_path, data)


def rename_key(file_path, old_key, new_key):
    """
    Rename a root-level key in the JSON file.
    
    Args:
        file_path (str): Path to JSON file
        old_key (str): Current key name
        new_key (str): New key name
    """
    data = read_json(file_path, default={})
    if old_key in data:
        data[new_key] = data.pop(old_key)
        write_json(file_path, data)


def get_all_keys(file_path, nested=False):
    """
    Get all keys in the JSON file.
    
    Args:
        file_path (str): Path to JSON file
        nested (bool): If True, returns flattened keys (e.g., 'a.b.c')
    
    Returns:
        list: List of keys
    """
    data = read_json(file_path, default={})
    if nested:
        return list(flatten_json(data).keys())
    else:
        return list(data.keys())


def increment_counter(file_path, key, amount=1):
    """
    Increment a numeric counter under a key. Creates the key if missing.
    
    Args:
        file_path (str): Path to JSON file
        key (str): Key to increment
        amount (int/float): Amount to increment by (default: 1)
    """
    data = read_json(file_path, default={})
    if key not in data or not isinstance(data[key], (int, float)):
        data[key] = 0
    data[key] += amount
    write_json(file_path, data)


# ============================================================================
# LIST OPERATIONS
# ============================================================================

def append_to_list(file_path, key, value):
    """
    Append a value to a list at the root-level key.
    Creates the list if it doesn't exist.
    
    Args:
        file_path (str): Path to JSON file
        key (str): Key containing the list
        value: Value to append
    """
    data = read_json(file_path, default={})
    if key not in data or not isinstance(data[key], list):
        data[key] = []
    data[key].append(value)
    write_json(file_path, data)


def remove_from_list(file_path, key, condition_func):
    """
    Remove elements from a list based on a condition function.
    
    Args:
        file_path (str): Path to JSON file
        key (str): Key containing the list
        condition_func (callable): Function that returns True for items to remove
    
    Example:
        # Remove donations with amount < 10
        remove_from_list('data.json', 'donations', lambda x: x['amount'] < 10)
    """
    data = read_json(file_path, default={})
    if key in data and isinstance(data[key], list):
        data[key] = [item for item in data[key] if not condition_func(item)]
        write_json(file_path, data)


def filter_by_key_value(file_path, key, filter_key, filter_value):
    """
    Filter items from a list where item[filter_key] == filter_value.
    
    Args:
        file_path (str): Path to JSON file
        key (str): Key containing the list
        filter_key (str): Key to filter by
        filter_value: Value to match
    
    Returns:
        list: Filtered items
    """
    data = read_json(file_path, default={})
    if key in data and isinstance(data[key], list):
        return [item for item in data[key] if item.get(filter_key) == filter_value]
    return []


def sort_list_by_key(file_path, list_key, sort_key, reverse=False):
    """
    Sort a list of dictionaries by a specified key.
    
    Args:
        file_path (str): Path to JSON file
        list_key (str): Key containing the list
        sort_key (str): Key to sort by
        reverse (bool): Sort in descending order if True
    """
    data = read_json(file_path, default={})
    if list_key in data and isinstance(data[list_key], list):
        try:
            data[list_key] = sorted(data[list_key], key=lambda x: x.get(sort_key, 0), reverse=reverse)
            write_json(file_path, data)
        except Exception:
            pass  # Ignore sorting errors


def count_entries(file_path, key):
    """
    Count the number of entries in a list under a key.
    
    Args:
        file_path (str): Path to JSON file
        key (str): Key containing the list
    
    Returns:
        int: Number of entries (0 if key doesn't exist or isn't a list)
    """
    data = read_json(file_path, default={})
    if key in data and isinstance(data[key], list):
        return len(data[key])
    return 0


# ============================================================================
# DATA MERGING AND TRANSFORMATION
# ============================================================================

def merge_json(file_path, new_data, overwrite=True):
    """
    Merge new_data into the root of the existing JSON file.
    
    Args:
        file_path (str): Path to JSON file
        new_data (dict): Data to merge
        overwrite (bool): If False, won't replace existing keys
    """
    data = read_json(file_path, default={})
    for key, value in new_data.items():
        if overwrite or key not in data:
            data[key] = value
    write_json(file_path, data)


def deep_merge_json(file_path, new_data):
    """
    Recursively merge new_data into the JSON file.
    
    Args:
        file_path (str): Path to JSON file
        new_data (dict): Data to merge recursively
    """
    def merge(d1, d2):
        for key in d2:
            if key in d1 and isinstance(d1[key], dict) and isinstance(d2[key], dict):
                merge(d1[key], d2[key])
            else:
                d1[key] = deepcopy(d2[key])
    
    data = read_json(file_path, default={})
    merge(data, new_data)
    write_json(file_path, data)


def flatten_json(data, parent_key='', sep='.'):
    """
    Flatten a nested JSON dictionary.
    
    Args:
        data (dict): Dictionary to flatten
        parent_key (str): Parent key prefix
        sep (str): Separator for nested keys
    
    Returns:
        dict: Flattened dictionary
    
    Example:
        {"a": {"b": 1}} → {"a.b": 1}
    """
    items = {}
    for k, v in data.items():
        new_key = f"{parent_key}{sep}{k}" if parent_key else k
        if isinstance(v, dict):
            items.update(flatten_json(v, new_key, sep=sep))
        else:
            items[new_key] = v
    return items


def unflatten_json(flat_data, sep='.'):
    """
    Convert flat dictionary back to nested dictionary.
    
    Args:
        flat_data (dict): Flattened dictionary
        sep (str): Separator used in keys
    
    Returns:
        dict: Nested dictionary
    
    Example:
        {"a.b": 1} → {"a": {"b": 1}}
    """
    result = {}
    for key, value in flat_data.items():
        parts = key.split(sep)
        d = result
        for part in parts[:-1]:
            d = d.setdefault(part, {})
        d[parts[-1]] = value
    return result


# ============================================================================
# TASK MANAGEMENT FUNCTIONS
# ============================================================================

def add_task(file_path="tasks.json", task_data="", status="pending", date=False, parent_key="tasks",
             time=False, counting=False, latest_time=True):
    """
    Add a task with full features: date/time/status/counting/log support.

    Args:
        file_path (str): Path to JSON file
        task_data (dict/str): Task info (e.g., {"name": "Do Homework"})
        status (str): Task status ("pending", "done", etc.)
        date (bool/str): True = today, str = specific date, False = no date grouping
        parent_key (str): Top-level key in JSON (e.g., "Donations Made")
        time (bool/str): True = now, str = specific time, False = no time
        counting (bool): If True, identical tasks increase "no_of_responses"
        latest_time (bool): If False, keep list of all times in "time_log"
    """
    data = read_json(file_path, default={})
    date_key = resolve_date_key(date)
    time_key = resolve_time_key(time)

    # Init structure
    if parent_key not in data:
        data[parent_key] = {} if date_key else []

    # Normalize task_data
    if isinstance(task_data, str):
        task_data = {"name": task_data}

    task = deepcopy(task_data)

    # Add status
    if status:
        task["status"] = status

    # Add time
    if time_key:
        if latest_time:
            task["time"] = time_key
        else:
            task["time_log"] = [time_key]
            task["time"] = time_key

    # Determine task identifier key (name, optionName, etc.)
    task_key = next((k for k in task_data.keys() if k in ["name", "optionName", "title"]), None)
    task_value = task_data.get(task_key)

    def update_or_add_task(task_list):
        for existing_task in task_list:
            if task_key and existing_task.get(task_key) == task_value:
                if counting:
                    existing_task["no_of_responses"] = existing_task.get("no_of_responses", 1) + 1
                    if time_key:
                        if latest_time:
                            existing_task["time"] = time_key
                        else:
                            existing_task.setdefault("time_log", []).append(time_key)
                            existing_task["time"] = time_key
                return True
        # New task
        if counting:
            task["no_of_responses"] = 1
        task_list.append(task)
        return False

    # Insert
    if date_key:
        data[parent_key].setdefault(date_key, [])
        update_or_add_task(data[parent_key][date_key])
    else:
        update_or_add_task(data[parent_key])

    write_json(file_path, data)


def update_task_status(file_path, task_identifier, new_status, date=False, parent_key="tasks"):
    """
    Update the status of a task by index or name.
    
    Args:
        file_path (str): Path to JSON file
        task_identifier (int/str): Task index or name to update
        new_status (str): New status value
        date (bool/str): Date grouping (True=today, str=specific date, False=no grouping)
        parent_key (str): Root key containing tasks
    
    Returns:
        bool: True if task was updated, False otherwise
    """
    data = read_json(file_path, default={})
    date_key = resolve_date_key(date)
    
    if parent_key not in data:
        return False

    # Get the appropriate task pool
    if date_key:
        task_pool = data[parent_key].get(date_key, [])
    else:
        task_pool = data[parent_key] if isinstance(data[parent_key], list) else []

    # Update the task
    for idx, task in enumerate(task_pool):
        if (isinstance(task_identifier, int) and idx == task_identifier) or \
           (isinstance(task_identifier, str) and task.get("name") == task_identifier):
            task_pool[idx]["status"] = new_status
            
            # Save changes back to data structure
            if date_key:
                data[parent_key][date_key] = task_pool
            else:
                data[parent_key] = task_pool
            
            write_json(file_path, data)
            return True
    
    return False


def filter_tasks_by_status(file_path, status, date=False, parent_key="tasks"):
    """
    Filter tasks by status with optional date filtering.
    
    Args:
        file_path (str): Path to JSON file
        status (str): Status to filter by
        date (bool/str): True (today), str (specific date), False (all dates)
        parent_key (str): Root key containing tasks
    
    Returns:
        list: Filtered tasks matching the status
    """
    data = read_json(file_path, default={})
    date_key = resolve_date_key(date)
    
    if parent_key not in data:
        return []

    results = []
    tasks = data[parent_key]

    if date_key:
        # Filter for specific date
        day_tasks = tasks.get(date_key, [])
        results = [t for t in day_tasks if t.get("status") == status]
    else:
        # Filter all tasks
        if isinstance(tasks, dict):  # Date-grouped structure
            for day_tasks in tasks.values():
                results.extend([t for t in day_tasks if t.get("status") == status])
        elif isinstance(tasks, list):  # Flat list structure
            results = [t for t in tasks if t.get("status") == status]

    return results


def list_all_statuses(file_path, parent_key="tasks"):
    """
    Get all unique status values currently used in tasks.
    
    Args:
        file_path (str): Path to JSON file
        parent_key (str): Root key containing tasks
    
    Returns:
        set: Set of all status values found
    """
    data = read_json(file_path, default={})
    statuses = set()
    
    tasks = data.get(parent_key, [])
    
    if isinstance(tasks, dict):  # Date-grouped structure
        for task_list in tasks.values():
            if isinstance(task_list, list):
                for task in task_list:
                    statuses.add(task.get("status", "unknown"))
    elif isinstance(tasks, list):  # Flat list structure
        for task in tasks:
            statuses.add(task.get("status", "unknown"))
    
    return statuses


