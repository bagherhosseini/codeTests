import hashlib

def crack_sha1_hash(hash, use_salts=False):
    """
    Crack a SHA-1 hashed password.

    Args:
        hash (str): The SHA-1 hash of the password to crack.
        use_salts (bool): Whether to use salts from known-salts.txt.

    Returns:
        str: The cracked password or "PASSWORD NOT IN DATABASE".
    """
    # Load the top 10,000 passwords
    with open('top-10000-passwords.txt', 'r') as f:
        passwords = f.read().splitlines()

    # If salts are required, load them
    salts = []
    if use_salts:
        with open('known-salts.txt', 'r') as f:
            salts = f.read().splitlines()

    # Define a helper function to hash strings using SHA-1
    def hash_sha1(input_string):
        return hashlib.sha1(input_string.encode('utf-8')).hexdigest()

    # If salts are not used, simply compare the hash of each password
    if not use_salts:
        for password in passwords:
            if hash_sha1(password) == hash:
                return password
    else:
        # When salts are used, try each salt prepended and appended to each password
        for password in passwords:
            for salt in salts:
                # Try salt + password and password + salt
                if hash_sha1(salt + password) == hash or hash_sha1(password + salt) == hash:
                    return password

    return "PASSWORD NOT IN DATABASE"

# Example testing in main.py
def main():
    print(sha1_password_cracker("b305921a3723cd5d70a375cd21a61e60aabb84ec"))  # Expected: "sammy123"
    print(sha1_password_cracker("c7ab388a5ebefbf4d550652f1eb4d833e5316e3e"))  # Expected: "abacab"
    print(sha1_password_cracker("5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8"))  # Expected: "password"

    print(sha1_password_cracker("53d8b3dc9d39f0184144674e310185e41a87ffd5", use_salts=True))  # Expected: "superman"
    print(sha1_password_cracker("da5a4e8cf89539e66097acd2f8af128acae2f8ae", use_salts=True))  # Expected: "q1w2e3r4t5"
    print(sha1_password_cracker("ea3f62d498e3b98557f9f9cd0d905028b3b019e1", use_salts=True))  # Expected: "bubbles1"

if __name__ == "__main__":
    main()
