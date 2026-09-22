#!/usr/bin/env python3
"""
InterviewVerseAI - Service Initiator Script
Allows starting, monitoring, and stopping Frontend, Backend, and AI Services inside terminal.
"""

import os
import sys
import time
import socket
import platform
import subprocess

# Root directory path
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(ROOT_DIR, "frontend")
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")
AI_SERVICES_DIR = os.path.join(ROOT_DIR, "ai-services")
LOGS_DIR = os.path.join(ROOT_DIR, "logs")

# Ensure logs directory exists
os.makedirs(LOGS_DIR, exist_ok=True)

# Default Ports
PORT_FRONTEND = 5173
PORT_BACKEND = 5000
PORT_AI = 8000

# Global process tracker
processes = {
    "frontend": None,
    "backend": None,
    "ai_services": None
}

IS_WINDOWS = platform.system().lower() == "windows"

if IS_WINDOWS:
    os.system("color")  # Enable ANSI escape sequences in Windows CMD

# ANSI color codes
CYAN = "\033[96m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
BOLD = "\033[1m"
RESET = "\033[0m"


def is_port_in_use(port):
    """Check if a local TCP port is currently listening."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.5)
        return s.connect_ex(('127.0.0.1', port)) == 0


def kill_process_on_port(port):
    """Kill any process listening on a specified port."""
    if not is_port_in_use(port):
        return
    try:
        if IS_WINDOWS:
            cmd = f'netstat -ano | findstr :{port}'
            output = subprocess.check_output(cmd, shell=True, text=True)
            for line in output.strip().split('\n'):
                parts = line.split()
                if len(parts) >= 5 and 'LISTENING' in parts:
                    pid = parts[-1]
                    subprocess.run(f'taskkill /F /PID {pid}', shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        else:
            cmd = f'lsof -t -i:{port}'
            output = subprocess.check_output(cmd, shell=True, text=True)
            for pid in output.strip().split('\n'):
                if pid:
                    subprocess.run(f'kill -9 {pid}', shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except Exception:
        pass


def get_process_status(service_name, port):
    """Return colored status string for a given service."""
    proc = processes.get(service_name)
    if proc and proc.poll() is None:
        return f"{GREEN}RUNNING{RESET} (PID: {proc.pid})"
    elif is_port_in_use(port):
        return f"{GREEN}RUNNING{RESET} (Port {port} Active)"
    else:
        return f"{RED}STOPPED{RESET}"


def start_frontend():
    """Start Frontend React app in terminal background."""
    if processes["frontend"] and processes["frontend"].poll() is None:
        print(f"\n{YELLOW}[!] Frontend is already running (PID: {processes['frontend'].pid}).{RESET}")
        return
    if is_port_in_use(PORT_FRONTEND):
        print(f"\n{YELLOW}[!] Port {PORT_FRONTEND} is already in use by an active process.{RESET}")
        return

    print(f"\n{CYAN}[+] Starting Frontend inside terminal...{RESET}")
    try:
        log_path = os.path.join(LOGS_DIR, "frontend.log")
        log_file = open(log_path, "a", encoding="utf-8")
        
        cmd = "npm run dev"
        proc = subprocess.Popen(
            cmd,
            cwd=FRONTEND_DIR,
            shell=True,
            stdout=log_file,
            stderr=subprocess.STDOUT
        )
        
        processes["frontend"] = proc
        print(f"{GREEN}[✓] Frontend started! Listening on http://localhost:{PORT_FRONTEND} (PID: {proc.pid}){RESET}")
        print(f"{YELLOW}    Log file: logs/frontend.log{RESET}")
    except Exception as e:
        print(f"{RED}[✕] Failed to start Frontend: {e}{RESET}")


def start_backend():
    """Start Backend Express server in terminal background."""
    if processes["backend"] and processes["backend"].poll() is None:
        print(f"\n{YELLOW}[!] Backend is already running (PID: {processes['backend'].pid}).{RESET}")
        return
    if is_port_in_use(PORT_BACKEND):
        print(f"\n{YELLOW}[!] Port {PORT_BACKEND} is already in use by an active process.{RESET}")
        return

    print(f"\n{CYAN}[+] Starting Backend inside terminal...{RESET}")
    try:
        log_path = os.path.join(LOGS_DIR, "backend.log")
        log_file = open(log_path, "a", encoding="utf-8")
        
        cmd = "npm run dev"
        proc = subprocess.Popen(
            cmd,
            cwd=BACKEND_DIR,
            shell=True,
            stdout=log_file,
            stderr=subprocess.STDOUT
        )
        
        processes["backend"] = proc
        print(f"{GREEN}[✓] Backend started! Listening on http://localhost:{PORT_BACKEND} (PID: {proc.pid}){RESET}")
        print(f"{YELLOW}    Log file: logs/backend.log{RESET}")
    except Exception as e:
        print(f"{RED}[✕] Failed to start Backend: {e}{RESET}")


def start_ai_services():
    """Start AI Services FastAPI app in terminal background."""
    if processes["ai_services"] and processes["ai_services"].poll() is None:
        print(f"\n{YELLOW}[!] AI Services is already running (PID: {processes['ai_services'].pid}).{RESET}")
        return
    if is_port_in_use(PORT_AI):
        print(f"\n{YELLOW}[!] Port {PORT_AI} is already in use by an active process.{RESET}")
        return

    print(f"\n{CYAN}[+] Starting AI Services inside terminal...{RESET}")
    python_exe = sys.executable
    try:
        log_path = os.path.join(LOGS_DIR, "ai_services.log")
        log_file = open(log_path, "a", encoding="utf-8")
        
        cmd = f'"{python_exe}" -m uvicorn app:app --host 0.0.0.0 --port {PORT_AI} --reload'
        proc = subprocess.Popen(
            cmd,
            cwd=AI_SERVICES_DIR,
            shell=True,
            stdout=log_file,
            stderr=subprocess.STDOUT
        )
        
        processes["ai_services"] = proc
        print(f"{GREEN}[✓] AI Services started! Listening on http://localhost:{PORT_AI} (PID: {proc.pid}){RESET}")
        print(f"{YELLOW}    Log file: logs/ai_services.log{RESET}")
    except Exception as e:
        print(f"{RED}[✕] Failed to start AI Services: {e}{RESET}")


def start_all():
    """Start Frontend, Backend, and AI Services."""
    print(f"\n{CYAN}{BOLD}=== Starting All Services ==={RESET}")
    start_frontend()
    time.sleep(1)
    start_backend()
    time.sleep(1)
    start_ai_services()
    print(f"\n{GREEN}{BOLD}[✓] All services started successfully inside terminal!{RESET}")


def close_service(name, proc, port):
    """Safely terminate a service process and release port."""
    if proc and proc.poll() is None:
        try:
            if IS_WINDOWS:
                subprocess.run(["taskkill", "/F", "/T", "/PID", str(proc.pid)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            else:
                proc.terminate()
                proc.wait(timeout=2)
        except Exception:
            try:
                proc.kill()
            except Exception:
                pass
    kill_process_on_port(port)


def close_all():
    """Close all running services and free ports."""
    print(f"\n{YELLOW}{BOLD}=== Closing All Services ==={RESET}")
    close_service("frontend", processes["frontend"], PORT_FRONTEND)
    processes["frontend"] = None
    print(f"{CYAN}[-] Frontend closed (Port {PORT_FRONTEND} released){RESET}")

    close_service("backend", processes["backend"], PORT_BACKEND)
    processes["backend"] = None
    print(f"{CYAN}[-] Backend closed (Port {PORT_BACKEND} released){RESET}")

    close_service("ai_services", processes["ai_services"], PORT_AI)
    processes["ai_services"] = None
    print(f"{CYAN}[-] AI Services closed (Port {PORT_AI} released){RESET}")

    print(f"{GREEN}[✓] All services closed successfully!{RESET}")


def print_menu():
    """Display interactive terminal menu."""
    print(f"\n{CYAN}{BOLD}======================================================{RESET}")
    print(f"{BOLD}           INTERVIEWVERSE AI - SERVICE CONTROL         {RESET}")
    print(f"{CYAN}{BOLD}======================================================{RESET}")
    print(f" {BOLD}Services Status:{RESET}")
    print(f"  1) Frontend    (Port {PORT_FRONTEND}) : {get_process_status('frontend', PORT_FRONTEND)}")
    print(f"  2) Backend     (Port {PORT_BACKEND}) : {get_process_status('backend', PORT_BACKEND)}")
    print(f"  3) AI Services (Port {PORT_AI}) : {get_process_status('ai_services', PORT_AI)}")
    print(f"{CYAN}------------------------------------------------------{RESET}")
    print(f" {BOLD}Options:{RESET}")
    print(f"  {BOLD}1){RESET} Start Frontend")
    print(f"  {BOLD}2){RESET} Start Backend")
    print(f"  {BOLD}3){RESET} Start AI Services")
    print(f"  {BOLD}4){RESET} Start All")
    print(f"  {BOLD}5){RESET} Exit")
    print(f"  {BOLD}6){RESET} Close All")
    print(f"{CYAN}{BOLD}======================================================{RESET}")


def main():
    """Main CLI loop."""
    while True:
        try:
            print_menu()
            choice = input(f"\n{BOLD}Select an option (1-6): {RESET}").strip()

            if choice == "1":
                start_frontend()
                time.sleep(1)
            elif choice == "2":
                start_backend()
                time.sleep(1)
            elif choice == "3":
                start_ai_services()
                time.sleep(1)
            elif choice == "4":
                start_all()
                time.sleep(1)
            elif choice == "5":
                any_running = is_port_in_use(PORT_FRONTEND) or is_port_in_use(PORT_BACKEND) or is_port_in_use(PORT_AI)
                if any_running:
                    ans = input(f"\n{YELLOW}Do you want to close all running services before exiting? (y/n, default: y): {RESET}").strip().lower()
                    if ans != 'n':
                        close_all()
                print(f"\n{GREEN}Exiting initiator. Services stay active in terminal background 👋{RESET}\n")
                sys.exit(0)
            elif choice == "6":
                close_all()
                time.sleep(1)
            else:
                print(f"\n{RED}[!] Invalid option. Please enter a number from 1 to 6.{RESET}")
                time.sleep(1)

        except (KeyboardInterrupt, EOFError):
            print(f"\n\n{YELLOW}Keyboard interrupt detected. Exiting...{RESET}")
            sys.exit(0)


if __name__ == "__main__":
    main()
