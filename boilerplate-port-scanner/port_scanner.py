import socket
from common_ports import ports_and_services
import re

def get_open_ports(target, port_range, verbose=False):
    def is_valid_ip(ip):
        """Validates an IP address."""
        try:
            socket.inet_aton(ip)
            return True
        except socket.error:
            return False

    def resolve_hostname(hostname):
        """Resolves hostname to an IP address."""
        try:
            return socket.gethostbyname(hostname)
        except socket.error:
            return None

    # Determine if target is an IP or hostname
    ip_address = None
    if is_valid_ip(target):
        ip_address = target
    else:
        ip_address = resolve_hostname(target)
        if not ip_address:
            return "Error: Invalid hostname"

    # Check for invalid IP
    if not is_valid_ip(ip_address):
        return "Error: Invalid IP address"

    # Scan ports in the specified range
    open_ports = []
    for port in range(port_range[0], port_range[1] + 1):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(1)  # Set timeout for the connection attempt
            if s.connect_ex((ip_address, port)) == 0:
                open_ports.append(port)

    # Generate verbose output if needed
    if verbose:
        hostname = target if not is_valid_ip(target) else None
        service_lines = []
        for port in open_ports:
            service_name = ports_and_services.get(port, "unknown")
            service_lines.append(f"{port:<8}{service_name}")

        result = f"Open ports for {hostname or ip_address} ({ip_address})\n"
        result += "PORT     SERVICE\n"
        result += "\n".join(service_lines)
        return result

    return open_ports
